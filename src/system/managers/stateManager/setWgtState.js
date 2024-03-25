import { queueChanges } from '../flowManager/index';

let getPropSpec;

export const init = ({ getPropSpec: _getPropSpec }) => {
	getPropSpec = _getPropSpec;
};

const applyLastStates = (next, propSpec, oldState, newState, deleteKeys) => {
	Object.entries(propSpec).forEach(([k, v]) => {
		if (!v.rememberLast)
			return;

		const oldValue = oldState[k];
		if (oldValue === undefined)
			return;

		const newValue = newState[k];
		if (newValue === undefined && !deleteKeys.includes(k))
			return;

		const newKey = `old${k[0].toUpperCase()}${k.substr(1)}`;

		next[newKey] = oldValue;
	});
};

const applySetActions = (next, propSpec, prev, newState, deleteKeys) => {
	Object.entries(newState).forEach(([key, value]) => {
		const prop = propSpec[key];
		if (
			!prop ||
			!prop.setAction ||
			deleteKeys.includes(key)
		)
			return;

		const setAction = prop.setAction;
		next[key] = setAction(prev[key], value, prev);
	});
};

const applyDeleteActions = (next, propSpec, prev, deleteKeys) => {
	//If value is defined, we received the instruction to delete from the Flow Manager.
	// In these situations, we need to send the previous value of the flow in to the
	// deleteAction so we don't clear filters on grids (for example) when the state has
	// been overridden internally.
	deleteKeys.forEach(({ key, value }) => {
		const prop = propSpec[key];

		//If there's no propSpec for this key, just delete
		if (!prop) {
			delete next[key];

			return;
		}

		//If there's a deleteAction, that takes precedence over dft
		if (prop.deleteAction && value !== undefined) {
			next[key] = prop.deleteAction(prev[key], value);

			return;
		}

		//Apply defaults, if applicable
		const dft = prop.dft;
		if (dft !== undefined) {
			if (typeof(dft) === 'function')
				next[key] = dft(next);
			else
				next[key] = dft;

			return;
		}

		//If we reach this point, just delete
		delete next[key];
	});
};

const applySubKeyStates = (state, subKeys) => {
	subKeys.forEach(({ key, subKey, value }) => {
		if (!state[key])
			state[key] = {};

		state[key][subKey] = value;
	});
};

const getNextStateComplex = (propSpec, prev, newState) => {
	const deleteKeys = newState.deleteKeys || [];
	delete newState.deleteKeys;

	const subKeys = newState.subKeys || [];
	delete newState.subKeys;

	const result = {
		...prev,
		...newState
	};

	applyLastStates(result, propSpec, prev, newState, deleteKeys);
	applySubKeyStates(result, subKeys);
	applySetActions(result, propSpec, prev, newState, deleteKeys);
	applyDeleteActions(result, propSpec, prev, deleteKeys);

	return result;
};

export const getNextState = (propSpec, prev, newState) => {
	//If there's a propSpec, we use a different (more complex) function
	if (propSpec) {
		const complexResult = getNextStateComplex(propSpec, prev, newState);

		return complexResult;
	}

	const result = {
		...prev,
		...newState
	};

	return result;
};

const notifyFlowManagerOfChanges = (id, newState, deleteKeys, finalState) => {
	const delta = {};
	Object.keys(newState).forEach(n => {
		delta[n] = finalState[n];
	});

	const deltaDelete = [];
	if (deleteKeys) {
		deleteKeys.forEach(d => {
			const { key } = d;

			if (finalState[key] !== undefined) {
				delta[key] = finalState[key];

				return;
			}

			deltaDelete.push(d);
		});
	}

	queueChanges(id, delta, deltaDelete, finalState);
};

const setWgtState = (id, newState, currentState, getWgtState) => {
	//It's allowed to call deleteKeys with just an array of keys instead of { key, value }
	//  in which case we just morph it here so that flowManager doesn't need any hackery
	const deleteKeys = newState.deleteKeys;
	if (deleteKeys) {
		deleteKeys.forEach((k, i) => {
			if (k.key !== undefined)
				return;

			deleteKeys[i] = { key: k };
		});
	}

	const subKeys = newState.subKeys || [];

	const stateRecorder = getWgtState('STATERECORDER');
	if (stateRecorder && stateRecorder.recordState)
		stateRecorder.recordState(id, newState);

	const { setLocalState, type } = currentState;
	const propSpec = getPropSpec(type);

	setLocalState(prev => {
		const next = getNextState(propSpec, prev, newState);
		next.updates++;

		currentState.localState = next;

		subKeys.forEach(s => {
			newState[s.key] = next[s.key];
		});

		notifyFlowManagerOfChanges(id, newState, deleteKeys, next);

		return next;
	});
};

export default setWgtState;
