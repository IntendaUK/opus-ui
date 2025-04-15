//System Helpers
import { clone, spliceWhere } from '../../helpers';

let keyLookup;

export const generateKeyLookup = () => {
	const stringifiedKeyLookup = localStorage.getItem('keyLookup');
	keyLookup = stringifiedKeyLookup ? JSON.parse(stringifiedKeyLookup) : [];
};

export const getKeyLookup = () => {
	return keyLookup;
};

const syncKeyLookup = () => {
	localStorage.setItem('keyLookup', JSON.stringify(keyLookup));
};

export const addLookupKey = (type, subType, key, lookupKey) => {
	keyLookup.push({
		type,
		subType,
		key,
		lookupKey
	});
	syncKeyLookup();
};

export const removeLookupKey = lookupKey => {
	spliceWhere(keyLookup, ({ lookupKey: lKey }) => lKey === lookupKey);
	syncKeyLookup();
};

export const filterKeyLookup = query => {
	let filteredKeyLookup = clone(keyLookup);

	Object.entries(query).forEach(
		([key, value]) => {
			filteredKeyLookup = filteredKeyLookup.filter(e => e[key] === value);
		}
	);

	return filteredKeyLookup;
};

export const buildLookupKey = (type, subType, key) => {
	const builtLookupKey = `${type}-${subType}-${key}`;

	return builtLookupKey;
};

export const lookupKeyContainsEntry = (type, subType, key) => {
	const query = {
		type,
		subType,
		key
	};

	const matches = filterKeyLookup(query);

	return !!matches.length;
};

export const clearKeyLookup = () => {
	keyLookup.length = 0;
	syncKeyLookup();
};
