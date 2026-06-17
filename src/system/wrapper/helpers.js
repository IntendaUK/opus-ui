/* eslint-disable max-lines, max-lines-per-function, no-inline-comments */

//System
import { emit } from '../managers/eventManager';
import { getPropertyContainer } from '../managers/propertyManager';
import { stateManager } from '../managers/stateManager';
import { wrapScriptHandlerInActions } from './wrapScriptHandlerInActions';

//Components
import ChildWgt from './childWgt';

//Helpers
import morphProps from './helpers/morphProps';
import setAutoHoverPrps from './helpers/setAutoHoverPrps';
import { registerScripts as registerScriptsBase } from '../../components/scriptRunner/interface';
import { getMdaHelper } from '../../components/scriptRunner/actions/getMda/getMda';

export const applyPropSpec = ({ prps = {}, id, type }, propSpec) => {
	//The first run ignores default values that are functions since
	// those must run after the initial defaults are applied.
	// An example of this is a component with no properties sent through:
	// It could have a default property of A='abc' and a property B with
	// a default function that returns 123 when A === 'abc'. Depending on the
	// order of input properties, it will function differently
	const defaultGeneratorFunctions = [];

	Object.entries(propSpec).forEach(entry => {
		const [prop, { dft }] = entry;
		const { [prop]: currentValue } = prps;

		if (currentValue !== undefined || dft === undefined)
			return;

		if (typeof (dft) === 'function') {
			defaultGeneratorFunctions.push(entry);

			return;
		}

		prps[prop] = dft;
	});

	// We store generated defaults inside staged props here and assign them later
	// so we don't allow cascading defaults
	const stagedProps = {};
	defaultGeneratorFunctions.forEach(([prop, { dft }]) => {
		const generatedDft = dft(prps, id, type);
		if (generatedDft !== undefined)
			stagedProps[prop] = generatedDft;
	});

	Object.assign(prps, stagedProps);

	return prps;
};

export const buildProps = (wgts, setState, id) => {
	const props = getPropertyContainer(id);
	props.id = id;
	props.setState = setState;
	props.setWgtState = stateManager.setWgtState;
	props.getWgtState = stateManager.getWgtState;
	props.emit = emit.bind(null, id);
	props.getHandler = (fn, ...rest) => fn.bind(null, props, ...rest);
	props.ChildWgt = ChildWgt.bind(null, id);

	return props;
};

const deprecationsWarned = [];

const warnDeprecations = ({ id, type, prps = {} }, propSpec) => {
	Object.entries(propSpec).forEach(([prop, spec]) => {
		if (!spec.deprecated)
			return;

		const value = prps[prop];
		if (value === undefined)
			return;

		const hasWarned = deprecationsWarned.some(w => w.type === type && w.prop === prop);
		if (hasWarned)
			return;

		deprecationsWarned.push({
			type,
			prop
		});

		const msg = `PROPERTY DEPRECATION WARNING: [${id}.${prop} = ${value}]`;

		/* eslint-disable-next-line no-console */
		console.info(msg);
	});
};

const buildMorphProps = (props, result = [], path = []) => {
	Object.entries(props).forEach(([k, v]) => {
		if (v?.indexOf && (v.indexOf('{{morph.') === 0 || v.indexOf('((morph.') === 0)) {
			result.push([...path, k].join('.'));
			props[k] = v.replace('morph', 'state');
		}

		if (typeof (v) === 'object' && v !== null)
			buildMorphProps(v, result, [...path, k]);
	});

	return result;
};

export const buildMappedProps = (propSpec, mda) => {
	if (typeof(mda.prps) !== 'object' || mda.prps === null)
		mda.prps = {};

	warnDeprecations(mda, propSpec);

	const props = applyPropSpec(mda, propSpec);
	setAutoHoverPrps(props);

	props.morphProps = buildMorphProps(props, props.morphProps);
	morphProps(mda.id, props);

	return props;
};

export const getKey = ({ id, index }) => {
	const key = `${id}-${index}`;

	return key;
};

const getActionsArray = script => {
	const { actions } = script ?? {};

	if (!actions)
		return null;

	return Array.isArray(actions) ? actions : [actions];
};

const getSourceHandler = async path => {
	const handlerString = await getMdaHelper({
		type: 'dashboard',
		key: path,
		fileType: 'js'
	});

	const moduleUrl = `data:text/javascript;charset=utf-8,${encodeURIComponent(handlerString)}`;
	const handler = await import(/* @vite-ignore */ moduleUrl);

	return handler.default;
};

const hydrateSourceAction = async ({ action, script, ownerId }) => {
	const { srcAction, srcActions, ...rest } = action;
	const sourceAction = srcAction ?? srcActions;

	if (!sourceAction)
		return action;

	const handler = await getSourceHandler(sourceAction.path);

	const [ wrappedAction ] = wrapScriptHandlerInActions({
		script,
		ownerId,
		handler
	});

	return {
		...rest,
		...wrappedAction
	};
};

const hydrateActionTree = async ({ action, script, ownerId }) => {
	if (!action)
		return action;

	if (Array.isArray(action)) {
		return await Promise.all(
			action.map(entry => hydrateActionTree({
				action: entry,
				script,
				ownerId
			}))
		);
	}

	if (typeof (action) !== 'object')
		return action;

	const hydratedAction = await hydrateSourceAction({
		action,
		script,
		ownerId
	});

	await Promise.all(
		Object.entries(hydratedAction).map(async ([key, value]) => {
			if (!value || typeof (value) !== 'object')
				return;

			hydratedAction[key] = await hydrateActionTree({
				action: value,
				script,
				ownerId
			});
		})
	);

	return hydratedAction;
};

export const hydrateSourceActions = async ({ script, ownerId }) => {
	if (!script)
		return script;

	const srcActions = script.srcActions ?? script.srcAction;
	if (srcActions) {
		const handler = await getSourceHandler(srcActions.path);

		script.actions = wrapScriptHandlerInActions({
			script,
			ownerId,
			handler
		});
		delete script.srcActions;
		delete script.srcAction;
	}

	const actions = getActionsArray(script);
	if (!actions)
		return script;

	const hydratedActions = await hydrateActionTree({
		action: actions,
		script,
		ownerId
	});

	if (Array.isArray(script.actions))
		script.actions = hydratedActions;
	else
		script.actions = hydratedActions[0];

	return script;
};

export const hasSourceActions = script => {
	if (!script)
		return false;

	if (script.srcActions || script.srcAction)
		return true;

	const actions = getActionsArray(script);
	if (!actions)
		return false;

	return actions.some(action => action?.srcAction);
};

const getScriptsArray = scripts => {
	if (!scripts)
		return [];

	return Array.isArray(scripts) ? scripts : [scripts];
};

const hasSourceActionKey = value => {
	if (!value)
		return false;

	const frontier = [value];
	const seen = new Set();

	while (frontier.length) {
		const current = frontier.pop();
		if (!current || typeof (current) !== 'object')
			continue;

		if (seen.has(current))
			continue;

		seen.add(current);

		if (
			Object.hasOwn(current, 'srcAction') ||
			Object.hasOwn(current, 'srcActions')
		)
			return true;

		frontier.push(...Object.values(current));
	}

	return false;
};

export const hydrateSourceActionsInMda = async mda => {
	if (!mda)
		return;

	const { prps = {}, wgts = [] } = mda;

	await Promise.all([
		...getScriptsArray(prps.dtaScps).map(script => hydrateSourceActions({
			script,
			ownerId: mda.id
		})),
		hydrateSourceActions({
			script: prps.fireScript,
			ownerId: mda.id
		}),
		...wgts.map(wgtMda => hydrateSourceActionsInMda(wgtMda))
	]);
};

export const hasSourceActionsInRunnablePrps = ({ prps = {} }) => {
	return (
		hasSourceActionKey(prps.fireScript) ||
		hasSourceActionKey(prps.dtaScps)
	);
};

export const registerScripts = async ({ id, scps }) => {
	if (!scps)
		return;

	const registerQueue = await Promise.all(
		scps.map(async s => {
			//Wrap a raw JS handler (registered from js rather than json) into actions.
			// srcActions/srcAction take precedence and are hydrated below.
			if (s.handler && !s.srcActions && !s.srcAction) {
				s.actions = wrapScriptHandlerInActions({
					script: s,
					ownerId: id,
					handler: s.handler
				});
				delete s.handler;
			}

			await hydrateSourceActions({
				script: s,
				ownerId: id
			});

			return {
				id,
				script: s
			};
		})
	);

	await registerScriptsBase(registerQueue);
};
