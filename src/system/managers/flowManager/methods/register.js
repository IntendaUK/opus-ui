/*
	This method registers flows. It is called in various places
		but most prominently by Wrapper when a component mounts.
*/

//System
import { stateManager } from '../../stateManager';

//Helpers
import getTransformedFlows from '../helpers/getTransformedFlows';
import { registerListener, alertListenerOfChanges } from '../stores/storeListeners';

const register = (flows, fromId, fullState) => {
	if (!flows)
		return;

	const transformedFlows = getTransformedFlows(flows, fromId);

	transformedFlows.forEach(f => {
		const { loadInitialValue = true } = f;

		const listener = registerListener(f, fromId);

		if (!loadInitialValue)
			return;

		const { from, fromTag, currentValue } = listener;

		//If the source component exists, we can fake an emit to set currentValues
		// so that initialState can be calculated properly.
		if (currentValue !== undefined || (!from && !fromTag))
			return;

		if (from) {
			const wgtState = stateManager.getWgtState(from);
			if (wgtState)
				alertListenerOfChanges(listener, wgtState, fullState);
		} else if (fromTag) {
			const states = stateManager.getWgtStatesWithTag(fromTag);
			states.forEach(state => {
				alertListenerOfChanges(listener, state, fullState);
			});
		}
	});
};

export default register;
