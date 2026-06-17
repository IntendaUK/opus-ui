//System Helpers
import { clone, spliceWhere } from '../../system/helpers';
import { applyBlueprints } from '../../system/managers/blueprintManager';
import setupSuiteActions from './helpers/setupSuiteActions';
import { resolveThemeAccessor } from '../../system/managers/themeManager';
import { getMdaHelper } from '../scriptRunner/actions/getMda/getMda';

//Helpers
import hookTrigger from './helpers/hookTrigger';
import { runScript as runScriptBase } from './helpers/runScript';
import runBlueprintScript from './helpers/runBlueprintScript';

//Internal variables
let props;

//Disposers for scripts are stored in here against the owner id
const disposeStash = {};

//Exports
export const disposeScripts = id => {
	const disposers = disposeStash[id];
	if (!disposers)
		return;

	disposers.forEach(d => d());
};

export const setDisposers = (id, list) => {
	if (!disposeStash[id])
		disposeStash[id] = [];

	disposeStash[id].push(...list);
};

export const removeDisposer = (id, disposer) => {
	if (!disposeStash[id])
		disposeStash[id] = [];

	spliceWhere(disposeStash[id], d => d === disposer);
};

export const registerScripts = async scripts => {
	for (let { id, script: originalScript } of scripts) {
		const script = clone({}, originalScript);
		script.ownerId = id;

		if (script.concurrency !== undefined && script.concurrency.pool === undefined)
			script.concurrency.pool = script.id;

		const { blueprint } = script;

		if (blueprint !== undefined)
			applyBlueprints(script);

		if (script.suite) {
			setupSuiteActions({
				ownerId: id,
				script
			});

			delete script.suite;
		}

		let { triggers = [] } = script;
		if (triggers.length === 0)
			triggers = [ { event: 'onMount' } ];

		//This part ensures that any onMount trigger for the source component is first.
		// Otherwise, due to the async nature of registerScriptBase, we'll miss out on the onMount
		// event firing in the FlowChecker component
		triggers.sort(({ event, source }) => {
			if (event === 'onMount' && (source === undefined || source === id))
				return -1;

			return 0;
		});

		for (let t of triggers) {
			const disposers = await hookTrigger(t, props, script);
			if (disposers)
				setDisposers(id, disposers);
		}
	}
};

export const runScript = originalScript => {
	if (Array.isArray(originalScript)) {
		originalScript.forEach(o => runScript(o));

		return;
	}

	const script = clone({}, originalScript);

	if (script.concurrency !== undefined && script.concurrency.pool === undefined)
		script.concurrency.pool = script.id;

	const { actions, blueprint, traits } = script;

	if (blueprint)
		runBlueprintScript(props, script);
	else if (traits) {
		traits.forEach(({ trait }) => {
			const mdaTrait = getMdaHelper({
				type: 'blueprint',
				key: trait
			});

			const stringTrait = JSON.stringify(mdaTrait);
			const stringAppliedThemes = resolveThemeAccessor(stringTrait);

			const mdaFinal = JSON.parse(stringAppliedThemes);

			Object.assign(script, mdaFinal);
		});

		runScriptBase(props, script, script.actions, true);
	} else
		runScriptBase(props, script, actions, true);
};

export const configure = _props => {
	props = _props;
};
