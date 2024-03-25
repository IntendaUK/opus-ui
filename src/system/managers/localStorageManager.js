import { buildLookupKey,
	lookupKeyContainsEntry,
	addLookupKey,
	removeLookupKey,
	filterKeyLookup,
	getKeyLookup,
	clearKeyLookup } from './localStorageManager/keyLookupCache';

export const getItemForKey = lookupKey => {
	const item = JSON.parse(localStorage.getItem(lookupKey));

	return item;
};

// Should look like: { type: "string", subType: "string", key: "string" }
// but can contain extra properties if we require
// or can be undefined, in which case, all localStorage values are returned
export const getItem = query => {
	if (!query)
		return null;

	const filteredKeyLookup = filterKeyLookup(query)[0];

	if (!filteredKeyLookup)
		return null;

	const item = getItemForKey(filteredKeyLookup.lookupKey);

	return item;
};

export const getKeys = query => {
	if (!query) {
		const keyLookup = getKeyLookup();

		return keyLookup;
	}

	const filteredKeyLookup = filterKeyLookup(query);

	return filteredKeyLookup;
};

export const addItem = (type, subType, key, value) => {
	const lookupKey = buildLookupKey(type, subType, key);

	if (!lookupKeyContainsEntry(type, subType, key))
		addLookupKey(type, subType, key, lookupKey);

	localStorage.setItem(lookupKey, JSON.stringify(value));
};

export const removeItem = (type, subType, key) => {
	const lookupKey = buildLookupKey(type, subType, key);

	if (lookupKeyContainsEntry(type, subType, key))
		removeLookupKey(lookupKey);

	localStorage.removeItem(lookupKey);
};

export const clearLocalStorage = () => {
	localStorage.clear();
	clearKeyLookup();
};
