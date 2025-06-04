//System Helpers
import spliceWhere from '../../../helpers/spliceWhere';

//Helpers
import { getMappedFrom } from '../helpers/getMappedId';

//An event is anything that has happened for which there is a flow
/*
	{
		from: 'id',
		!fromTag: 'tag',
		fromKey: 'key',
		!fromSubKey: 'subKey',
		value: 'value',
		scope: 'scopeName'
	}
*/
const store = [];

export const destroyEventsForScope = scopeName => {
	spliceWhere(store, e => e.scope === scopeName);
};

export const destroyEventsForListener = listener => {
	const from = getMappedFrom(listener);
	const { fromKey, scope } = listener;

	spliceWhere(store, e => e.from === from && e.fromKey === fromKey && e.scope === scope);
};

export const findEventForListener = listener => {
	const { fromKey, fromSubKey, scope } = listener;

	const from = getMappedFrom(listener);

	const result = store.find(e => {
		const isMatch = (
			e.from === from &&
			e.fromKey === fromKey &&
			e.fromSubKey === fromSubKey &&
			e.scope === scope
		);

		return isMatch;
	});

	return result;
};

export const addEventEntry = (listener, value) => {
	const from = getMappedFrom(listener);
	const { fromKey, fromSubKey, scope } = listener;

	spliceWhere(store, e => {
		const isMatch = (
			e.from === from &&
			e.fromKey === fromKey &&
			e.fromSubKey === fromSubKey &&
			e.scope === scope
		);

		return isMatch;
	});

	const eventEntry = {
		from,
		fromKey,
		value,
		scope
	};

	if (fromSubKey !== undefined)
		eventEntry.fromSubKey = fromSubKey;

	store.push(eventEntry);
};

export const resetEvents = () => {
       store.length = 0;
};
