/* eslint-disable max-lines, max-lines-per-function, no-inline-comments */

//System
import { emit } from '../managers/eventManager';
import { getPropertyContainer } from '../managers/propertyManager';
import { stateManager } from '../managers/stateManager';
import { getScopedId } from '../managers/scopeManager';
import { isWrappedScriptHandler, wrapScriptHandlerInActions } from './wrapScriptHandlerInActions';

//Components
import ChildWgt from './childWgt';

//Helpers
import morphProps from './helpers/morphProps';
import setAutoHoverPrps from './helpers/setAutoHoverPrps';
import { registerScripts as registerScriptsBase } from '../../components/scriptRunner/interface';
import { hasSourceActionKey, hydrateSourceActions } from './sourceActionHelpers';

export { hasSourceActions, hydrateSourceActions } from './sourceActionHelpers';

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
	//setWgtState/getWgtState resolve ||scope.relId|| tokens automatically, rooted
	// at THIS component (closest enclosing scope owner) — the same semantics as
	// declarative script targets. Raw stateManager methods expect resolved ids and
	// would silently no-op on tokens.
	props.setWgtState = (idTarget, newState, source) => {
		if (typeof (idTarget) === 'string' && idTarget.includes('||'))
			idTarget = getScopedId(idTarget, id);

		return stateManager.setWgtState(idTarget, newState, source);
	};
	props.getWgtState = idSource => {
		if (typeof (idSource) === 'string' && idSource.includes('||'))
			idSource = getScopedId(idSource, id);

		return stateManager.getWgtState(idSource);
	};
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

const getScriptsArray = scripts => {
	if (!scripts)
		return [];

	return Array.isArray(scripts) ? scripts : [scripts];
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

	const registerQueue = scps.map(s => {
		//Wrap a raw JS handler (registered from js rather than json) into actions.
		// srcActions/srcAction take precedence and are hydrated below.
		// An already-wrapped handler (a scp definition that travelled through
		// hydrateActionTree inside another script's payload) is used as-is —
		// re-wrapping would invoke it with the args object instead of
		// (morphedConfig, script, props).
		if (s.handler && !s.srcActions && !s.srcAction) {
			s.actions = isWrappedScriptHandler(s.handler)
				? [{ handler: s.handler }]
				: wrapScriptHandlerInActions({
					script: s,
					ownerId: id,
					handler: s.handler
				});
			delete s.handler;
		}

		//Triggers must hook the moment the component registers — matching the
		// declarative app's timing, so no state transition fired during module
		// loading is ever missed. Hydration (the async data-URL import) runs in
		// parallel; initAndRunScript awaits the promise before the script's
		// first execution (a no-op afterwards).
		const hydration = hasSourceActionKey(s)
			? hydrateSourceActions({ script: s, ownerId: id })
			: null;

		return {
			id,
			script: s,
			hydration
		};
	});

	await registerScriptsBase(registerQueue);
};
