/*
	This method is called by various scriptRunner triggers to allow scripts to subscribe
		to certain events like: onMount, onUnmount, onKeyDown, etc.
*/

//System Helpers
import spliceWhere from '../../../helpers/spliceWhere';

//Stores
import { eventSubscriptions } from '../stores/storeMisc';

//Exports

//When 'from' is undefined, the event will be global
const subscribe = (from, ownerId, handler, event) => {
	const global = from === undefined;

	const sub = {
		from,
		global,
		event,
		ownerId,
		handler,
		lateBound: false
	};

	eventSubscriptions.push(sub);

	const unsub = () => spliceWhere(eventSubscriptions, l => l === sub);

	return unsub;
};

export default subscribe;
