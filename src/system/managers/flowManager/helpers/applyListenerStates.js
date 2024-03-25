//System
import { stateManager } from '../../stateManager';

//Helpers
import { getMappedTo } from './getMappedId';

let getPropSpec;

export const init = ({ getPropSpec: _getPropSpec }) => {
	getPropSpec = _getPropSpec;
};

export const applySingleListenerState = (state, { to, toKey, toSubKey, currentValue }) => {
	if (!toSubKey) {
		const tgtState = stateManager.getWgtState(to);
		const setAction = getPropSpec(tgtState?.type)?.[toKey]?.setAction;

		if (setAction)
			state[toKey] = setAction(state[toKey], currentValue, state);
		else
			state[toKey] = currentValue;
	} else {
		if (!state.subKeys)
			state.subKeys = [];

		state.subKeys.push({
			key: toKey,
			subKey: toSubKey,
			value: currentValue
		});
	}
};

const applyListenerStates = (targetStates, changedListeners) => {
	changedListeners.forEach(l => {
		if (l.to) {
			const to = getMappedTo(l);

			if (!targetStates[to])
				targetStates[to] = {};

			const toObject = targetStates[to];

			applySingleListenerState(toObject, l);
		} else if (l.toTag) {
			const toIds = stateManager.getWgtIdsWithTag(l.toTag);
			toIds.forEach(id => {
				if (!targetStates[id])
					targetStates[id] = {};

				const toObject = targetStates[id];

				applySingleListenerState(toObject, {
					...l,
					to: id
				});
			});
		}
	});
};

export default applyListenerStates;
