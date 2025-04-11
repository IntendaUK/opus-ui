//System Helpers
import { addItem, getKeys, getItemForKey, removeItem } from './localStorageManager';
import spliceWhere from '@spliceWhere';

//Contains all property objects
const propertyContainers = new Map();

//An array of all persisted states (does not include infinite scope states)
/*
	States take the form of:
	{
		id: 'The id of the component owning the state',
		key: 'The key to be set',
		subKey: '(optional) The subKey to be set',
		value: 'The value of the state',
		scope: 'How long this state should live. Options: 'session', '*', 'some id goes here'
	}
*/
// Scopes:
//  *:       Lasts forever (until localStorage is cleared) or until
//           clearPersistedStates is called for the owner id
//  session: Lasts until the tab/browser is closed
//  some id: Lasts until the component with the id (of 'some id') is unmounted
const persistTracker = [];

//Helpers
export const getPropertyContainer = id => {
	const exists = propertyContainers.get(id);
	if (exists)
		return exists;

	const container = {};
	propertyContainers.set(id, container);

	return container;
};

export const persistState = (id, key, subKey, value, scope) => {
	//Infinite scope does not go into the persistTracker array
	if (scope !== '*') {
		spliceWhere(persistTracker, f => f.id === id && f.key === key && f.subKey === subKey);

		persistTracker.push({
			id,
			key,
			subKey,
			value,
			scope
		});

		return;
	}

	const storageKey = subKey ? `${key}.${subKey}` : key;
	addItem('persistedState', id, storageKey, value);
};

export const getPersistedStates = id => {
	const states = persistTracker.filter(p => p.id === id);

	const localStorageKeys = getKeys({
		type: 'persistedState',
		subType: id
	});

	localStorageKeys.forEach(({ lookupKey, key }) => {
		const value = getItemForKey(lookupKey);
		if (value === undefined)
			return;

		let subKey;

		if (key.includes('.'))
			[key, subKey] = key.split('.');

		spliceWhere(states, s => s.key === key && s.subKey === subKey);
		states.push({
			key,
			subKey,
			value
		});
	});

	return states;
};

export const removePersistedStates = id => {
	spliceWhere(persistTracker, p => p.id === id);

	const localStorageKeys = getKeys({
		type: 'persistedState',
		subType: id
	});

	localStorageKeys.forEach(({ type, subType, key }) => {
		removeItem(type, subType, key);
	});
};

export const removePersistedStatesForScope = id => {
	spliceWhere(persistTracker, p => p.scope === id);
};
