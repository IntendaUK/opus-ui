//System
import opusConfig from '../../config';

//System Helpers
import { getPropertyContainer } from './propertyManager';

//Helpers
import sysSetWgtState from './stateManager/setWgtState';

//Internals
const appState = new Map();

//A list of component id's and the file path from where it was built
const componentPathMap = new Map();

export const deletedKeyValue = '{deleted}';

const reset = () => {
	appState.clear();
};

const initState = (id, setLocalState, localState, path, traitMappings, cpnForceRemount) => {
	if (appState.get(id))
		return;

	if (!componentPathMap.get(path))
		componentPathMap.set(path, []);

	componentPathMap.get(path).push(id);

	if (traitMappings) {
		Object.keys(traitMappings).forEach(traitPath => {
			if (!componentPathMap.get(traitPath))
				componentPathMap.set(traitPath, []);

			componentPathMap.get(traitPath).push(id);
		});
	}

	const state = {
		localState,
		setLocalState,
		forceRemount: cpnForceRemount
	};

	appState.set(id, state);
};

const setComponentType = (id, type) => {
	const current = appState.get(id);
	if (!current)
		return;

	current.type = type;
};

const getWgtState = id => {
	if (!id)
		return;

	const wState = appState.get(id);
	if (!wState)
		return;

	return wState.localState;
};

const getWgtIdsWithTag = tag => {
	const result = [];

	for (let [id, state] of appState) {
		if (state.localState?.tags?.includes(tag))
			result.push(id);
	}

	return result;
};

const getWgtStatesWithTag = tag => {
	const result = [];

	for (let [, state] of appState) {
		if (state.localState?.tags?.includes(tag))
			result.push(state.localState);
	}

	return result;
};

const cleanupState = (id, path, traitMappings) => {
	appState.delete(id);

	componentPathMap.get(path).spliceWhere(f => f === id);

	if (traitMappings) {
		Object.keys(traitMappings).forEach(traitPath => {
			if (!componentPathMap.get(traitPath))
				componentPathMap.set(traitPath, []);

			componentPathMap.get(traitPath).push(id);
		});
	}
};

const setAll = newState => {
	appState.forEach(val => {
		const { setLocalState } = val;
		setLocalState(prev => {
			const next = {
				...prev,
				...newState
			};
			val.localState = next;

			return next;
		});
	});
};

const setWgtState = (id, newState, source) => {
	const currentState = appState.get(id);
	if (!currentState)
		return null;

	if (opusConfig.env === 'development') {
		const props = getPropertyContainer(id);

		if (props.trackStateChange) {
			const cleanedCurrentState = { ...currentState.localState };
			if (cleanedCurrentState.boxRef)
				cleanedCurrentState.boxRef = '{{ref}}';

			const cleanedNewState = { ...newState };
			if (cleanedNewState.boxRef)
				cleanedNewState.boxRef = '{{ref}}';

			if (source) {
				props.trackStateChange({
					currentState: cleanedCurrentState,
					newState: cleanedNewState,
					sourceId: source.id,
					sourceType: source.type
				});
			}
		}
	}

	sysSetWgtState(id, newState, currentState, getWgtState);
};

const setSelfState = (id, newState) => {
	setWgtState(id, newState, {
		id,
		type: 'internal'
	});
};

const getComponentsOfType = componentType => {
	const res = [];

	for (let state of appState) {
		if (state[1].type === componentType)
			res.push(state[0]);
	}

	return res;
};

const getOwnerComponent = childId => {
	let res;

	for (let state of appState) {
		if (state[1].localState.wgts?.indexOf(childId) > -1) {
			res = state[0];

			break;
		}
	}

	return res;
};

export const getComponentIdsForPath = path => {
	return componentPathMap.get(path) ?? [];
};

export const forceRemount = (id, newMda) => {
	let includeNewMda = newMda.acceptPrps === undefined;
	const mda = includeNewMda ? newMda : undefined;

	appState.get(id).forceRemount(mda);
};

const stateManager = {
	initState,
	getWgtState,
	getWgtIdsWithTag,
	getWgtStatesWithTag,
	setWgtState,
	setSelfState,
	cleanupState,
	setAll,
	setComponentType,
	getComponentsOfType,
	getOwnerComponent,
	reset
};

export {
	appState,
	stateManager
};
