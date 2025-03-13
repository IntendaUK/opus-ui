//System
import opusConfig from '../../../config';

//System Helpers
import { applyTraitsToArray } from '../../../system/managers/traitManager';
import { clone } from '../../../system/helpers';

//Helpers
import { processAction, processActionSync } from './processAction';
import spreadActions from './spreadActions';
import { register as registerDiagnostics } from '../diagnostics/scripts';
import setupSuiteActions from './setupSuiteActions';

const scriptsQueue = [];
const runningScripts = [];

const canRunScript = ({ concurrency }) => {
	if (!concurrency || concurrency.mode === 'parallel')
		return true;

	const canRun = !runningScripts.some(f => f.concurrency?.pool === concurrency.pool);

	return canRun;
};

let processNextInQueue;

//Asynchronous Version

/* eslint-disable-next-line max-lines-per-function, complexity */
export const runScript = async (props, script, actions, isRootScript) => {
	const { state: { stopScriptString } } = props;

	if (script.suite) {
		setupSuiteActions({
			ownerid: script.ownerId,
			script
		});

		actions = script.actions;
	}

	spreadActions(script, actions, props);

	applyTraitsToArray(actions);

	const entry = {
		id: script.id,
		concurrency: script.concurrency
	};

	if (isRootScript) {
		if (!canRunScript(script)) {
			if (script.concurrency?.mode !== 'cancel') {
				scriptsQueue.push({
					script,
					actions
				});
			}

			return;
		}

		runningScripts.push(entry);
	}

	if (script.diagnostics?.track && opusConfig.env === 'development' && !script.trackAction) {
		const diagHelpers = registerDiagnostics({ script });
		script.trackAction = diagHelpers.trackAction;
		script.trackSubActions = diagHelpers.trackSubActions;
		script.stopTrackingSubActions = diagHelpers.stopTrackingSubActions;
		script.logDiagnostics = diagHelpers.logDiagnostics;
	}

	for (let a of actions) {
		const { id: branchScriptId, branch } = a;

		const result = await processAction(a, script, props);

		if (result === stopScriptString)
			break;

		if (branch) {
			const branchActions = branch[result + ''];
			if (branchActions) {
				let useScript = script;
				if (branchScriptId) {
					useScript = clone({}, script);
					useScript.id = branchScriptId;
				}

				if (script.trackSubActions)
					script.trackSubActions();

				await runScript(props, useScript, branchActions);

				if (script.trackSubActions)
					script.stopTrackingSubActions();
			}
		}
	}

	if (script.diagnostics?.track && opusConfig.env === 'development' && isRootScript)
		script.logDiagnostics();

	if (isRootScript) {
		runningScripts.spliceWhere(f => f === entry);

		if (script.concurrency)
			processNextInQueue(props, script);
	}
};

//Synchronous Version
// The reason we have this one is for propScripts (morphProps.js) since we do not support
// asynchronous scripts for calculating property values. That just lends to bad design
// in which we need to wait too long to see initial mounts.
export const runScriptSync = (props, script, actions) => {
	const { state: { stopScriptString } } = props;

	if (script.suite) {
		setupSuiteActions({
			ownerid: script.ownerId,
			script
		});

		actions = script.actions;
	}

	spreadActions(script, actions, props);

	if (script.diagnostics?.track && opusConfig.env === 'development') {
		const { trackAction, logDiagnostics } = registerDiagnostics({ script });
		script.trackAction = trackAction;
		script.logDiagnostics = logDiagnostics;
	}

	for (const a of actions) {
		const { branch } = a;
		const result = processActionSync(a, script, props);

		if (result === stopScriptString)
			break;

		if (branch) {
			const branchActions = branch[result + ''];
			if (branchActions)
				runScriptSync(props, script, branchActions);
		}
	}

	if (script.diagnostics?.track && opusConfig.env === 'development')
		script.logDiagnostics();
};

processNextInQueue = (props, { concurrency: { pool } }) => {
	const next = scriptsQueue.find(s => s.script.concurrency?.pool === pool && canRunScript(s.script));
	if (!next)
		return;

	scriptsQueue.spliceWhere(f => f === next);

	runScript(props, next.script, next.actions, true);
};
