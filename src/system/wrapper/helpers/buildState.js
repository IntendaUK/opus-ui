//System Helpers
import { getInitialState } from '../../managers/flowManager/index';
import { getNextState } from '../../managers/stateManager/setWgtState';
import { getPersistedStates } from '../../managers/propertyManager';

//Exports
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

const buildState = (mappedProps, { id, path, type, parentId }, propSpec, ignoreFlows) => {
	const builtState = {
		id,
		type,
		path,
		parentId,
		...mappedProps
	};

	if (builtState.persist) {
		const persisted = getPersistedStates(id);

		persisted.forEach(({ key, scope, value }) => {
			if (builtState.persist.includes(key) && scope === 'session')
				builtState[key] = value;
		});
	}

	if (ignoreFlows)
		return builtState;

	builtState.flows = buildFlows(builtState, builtState.flows);

	const flowState = getInitialState(id, builtState, propSpec);
	if (!Object.keys(flowState).length)
		return builtState;

	const result = getNextState(propSpec, builtState, flowState);

	return result;
};

export default buildState;
