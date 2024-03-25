//System
import { stateManager } from '../../../system/managers/stateManager';
import { getListenersWithTargetId,
	getListenersWithSourceId } from '../../../system/managers/flowManager/stores/storeListeners';

//Action
const getFlows = (config, script) => {
	const { ownerId } = script;
	const { target = ownerId, includeFrom, includeTo } = config;

	const state = stateManager.getWgtState(target);

	const result = [];

	if (includeFrom)
		result.push(...getListenersWithSourceId(target, state));

	if (includeTo)
		result.push(...getListenersWithTargetId(target, state));

	return result;
};

export default getFlows;
