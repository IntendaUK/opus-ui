//System Helpers
import { getInitialState } from '../../managers/flowManager/index';
import { getNextState } from '../../managers/stateManager/setWgtState';
import applyPropSpec from './applyPropSpec';
import morphProps from './morphProps';

const buildFlows = (state, flows = {}, propertyPath) => {
	Object.entries(state).forEach(([k, v]) => {
		if (typeof (v) !== 'string') {
			if (typeof (v) === 'object' && v !== null && propertyPath === undefined)
				buildFlows(v, flows, k);

			return;
		} else if (v.indexOf('{{flow.') !== 0)
			return;

		const split = v.replaceAll('{', '').replaceAll('}', '').split('.');

		const flow = {
			toKey: propertyPath ? propertyPath : k,
			toSubKey: propertyPath ? k : undefined,
			from: split[1],
			fromKey: split[2],
			fromSubKey: split[3]
		};

		flows.push(flow);
	});

	return flows;
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

const buildState = (fullPropSpec, mda, ignoreFlows = false) => {
	applyPropSpec(mda, fullPropSpec);

	const { id, type, path, parentId, prps } = mda;

	mda.prps.morphProps = buildMorphProps(mda.prps, mda.prps.morphProps);
	morphProps(mda.id, mda.prps);

	const builtState = {
		id,
		type,
		path,
		parentId,
		...prps,
		updates: 0
	};

	if (ignoreFlows)
		return builtState;

	builtState.flows = buildFlows(builtState, builtState.flows);

	const flowState = getInitialState(id, builtState, fullPropSpec);
	if (!Object.keys(flowState).length)
		return builtState;

	const result = getNextState(fullPropSpec, builtState, flowState);

	return result;
};

export default buildState;
