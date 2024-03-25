/*
	This method is called by:
		* Wrapper to get the initial state of a to-be-mounted component
		* Wrapper right after mounting a component to ensure we don't miss any new changes
			that might have been caused by flows during the mount
*/

//Helpers
import { applySingleListenerState } from '../helpers/applyListenerStates';
import { getListenersWithTargetId, destroyListener } from '../stores/storeListeners';

const getInitialState = (id, fullState, propSpec) => {
	const state = {};

	const listeners = getListenersWithTargetId(id, fullState);

	listeners.forEach(l => {
		const { toKey, currentValue } = l;

		if (currentValue === undefined)
			return;

		const prop = propSpec[toKey];
		if (prop) {
			const setAction = prop.setAction;

			if (setAction) {
				state[toKey] = setAction(state[toKey], currentValue, state);

				return;
			}
		}

		applySingleListenerState(state, l);

		if (l.destroyOnConsume)
			destroyListener(l);
	});

	return state;
};

export default getInitialState;
