//System
import { emit } from '../managers/eventManager';
import { getPropertyContainer } from '../managers/propertyManager';
import { getComponent as getComponentFromManager } from '../managers/componentManager';

//Components
import ChildWgt from './childWgt';

//Helpers
import morphProps from './helpers/morphProps';
import applyExtraProps from './helpers/applyExtraProps';
import setAutoHoverPrps from './helpers/setAutoHoverPrps';
import { registerScripts as registerScriptsBase } from '../../components/scriptRunner/interface';

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

export const buildProps = (wgts, setState, context, id) => {
	const { setWgtState, getWgtState } = context;

	const props = getPropertyContainer(id);
	props.id = id;
	props.setState = setState;
	props.setWgtState = setWgtState;
	props.getWgtState = getWgtState;
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

export const buildMorphProps = (props, result = [], path = []) => {
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

export const buildMappedProps = (context, propSpec, mda) => {
	if (typeof(mda.prps) !== 'object' || mda.prps === null)
		mda.prps = {};

	warnDeprecations(mda, propSpec);

	const props = applyPropSpec(mda, propSpec);
	setAutoHoverPrps(props);

	applyExtraProps(props);

	props.morphProps = buildMorphProps(props, props.morphProps);

	morphProps(mda.id, props, context);

	return props;
};

export const getComponent = ({ type }, context, setComponent) => {
	const Component = getComponentFromManager(type);

	setComponent({ Component });
};

export const registerScripts = async ({ id, scps }) => {
	if (!scps)
		return;

	const registerQueue = scps.map(s => {
		return {
			id,
			script: s
		};
	});

	await registerScriptsBase(registerQueue);
};