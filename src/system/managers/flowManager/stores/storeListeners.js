//System Helpers
import { clone } from '../../../helpers';
import { stateManager } from '../../stateManager';

//Helpers
import getMappedValue from '../helpers/getMappedValue';
import { addEventEntry, findEventForListener } from './storeEvents';
import { getMappedFrom, getMappedTo } from '../helpers/getMappedId';

//Internal Variables

//A listener is anything that should receive a flow
/*
	{
		from: string,
		!fromTag: string,
		fromKey: string,
		!fromSubKey: string,
		to: string,
		toKey: string,
		!toSubKey: string,
		!mapObject: object,
		!mapFunction: function,
		!setter: function,
		!currentValue: mixed,
		!previousValue: mixed,
		!ignoreEmptyString: boolean,
		!destroyOnConsume: boolean,
		!lateBound: boolean
		ownerId: string
	}
*/
const store = [];

export const globalScopeName = '{-global-}';

//Exports
export const registerListener = (flow, ownerId) => {
	const listener = clone({}, flow);

	const { from, tag, fromKey, fromSubKey, to, toKey, toSubKey, scope, lateBound } = listener;

	//Check if the listener has already been registered
	const listenerExists = store.find(l => {
		const isMatch = (
			l.from === from &&
			l.tag === tag &&
			l.fromKey === fromKey &&
			l.fromSubKey === fromSubKey &&
			l.to === to &&
			l.toKey === toKey &&
			l.toSubKey === toSubKey &&
			l.scope === scope &&
			l.ownerId === ownerId &&
			l.lateBound === lateBound
		);

		return isMatch;
	});

	if (listenerExists)
		return listenerExists;

	//If an event exists for this listener, set currentValue
	const event = findEventForListener(listener);
	if (event) {
		const fullState = stateManager.getWgtState(listener.to);
		const mappedValue = getMappedValue(listener, event.value, fullState);

		if (mappedValue !== undefined)
			listener.currentValue = mappedValue;
	}

	store.push(listener);

	return listener;
};

export const getAllListeners = () => {
	return store;
};

export const getListenersWithSourceId = (fromId, fullState) => {
	const result = store.filter(listener => {
		if (listener.from) {
			const mappedFrom = getMappedFrom(listener);

			const isMatch = mappedFrom === fromId;

			return isMatch;
		} else if (listener.fromTag) {
			const isMatch = fullState?.tags?.includes(listener.fromTag);

			return isMatch;
		}
	});

	return result;
};

export const getListenersWithTargetId = (toId, fullState) => {
	const result = store.filter(listener => {
		if (listener.to) {
			const mappedTo = getMappedTo(listener);

			const isMatch = mappedTo === toId;

			return isMatch;
		} else if (listener.toTag) {
			const isMatch = fullState?.tags?.includes(listener.toTag);

			return isMatch;
		}
	});

	return result;
};

export const isAnyoneListeningToSrcId = srcId => {
	const result = store.some(listener => {
		const from = getMappedFrom(listener);
		const isMatch = from === srcId;

		return isMatch;
	});

	return result;
};

export const isAnyoneListeningToSrcTag = tags => {
	const result = store.some(({ fromTag }) => {
		if (!fromTag)
			return false;

		const isMatch = tags.includes(fromTag);

		return isMatch;
	});

	return result;
};

export const alertListenerOfChanges = (listener, changedState, fullState) => {
	const { currentValue, fromKey, fromSubKey, setter } = listener;

	let value = changedState?.[fromKey];
	if (fromSubKey !== undefined)
		value = value?.[fromSubKey];

	if (value === undefined)
		return false;

	addEventEntry(listener, value);

	const mappedValue = getMappedValue(listener, value, fullState);

	if (mappedValue === undefined)
		return false;

	if (JSON.stringify(currentValue) === JSON.stringify(mappedValue))
		return false;

	listener.previousValue = currentValue;
	listener.currentValue = mappedValue;

	if (setter) {
		setter(mappedValue);

		return false;
	}

	return true;
};

export const alertListenersOfChanges = (from, changedState, fullState) => {
	const affectedListeners = [];

	store.forEach(listener => {
		if (listener.from) {
			const listenerFrom = getMappedFrom(listener);
			if (listenerFrom !== from)
				return;
		} else if (listener.fromTag && !fullState?.tags?.includes(listener.fromTag))
			return;

		const changed = alertListenerOfChanges(listener, changedState, fullState);

		if (changed)
			affectedListeners.push(listener);
	});

	return affectedListeners;
};

export const alertListenersOfDeletions = (from, deletedKeys) => {
	const affectedListeners = [];

	store.forEach(listener => {
		const { fromKey, currentValue } = listener;
		const listenerFrom = getMappedFrom(listener);

		if (listenerFrom !== from || currentValue === undefined)
			return;

		const isKeyDeleted = deletedKeys.some(({ key }) => key === fromKey);
		if (!isKeyDeleted)
			return;

		listener.previousValue = currentValue;
		delete listener.currentValue;

		affectedListeners.push(listener);
	});

	return affectedListeners;
};

export const resetListenerValuesForScope = scope => {
	store.forEach(listener => {
		const { scope: listenerScope, currentValue } = listener;

		if (listenerScope !== scope)
			return;

		listener.previousValue = currentValue;
		delete listener.currentValue;
	});
};

export const resetListeners = () => {
	store.length = [];
};

export const destroyListener = listener => {
	store.spliceWhere(s => s === listener);
};

export const destroyListenersForScope = scope => {
	store.spliceWhere(s => s.scope === scope);
};
