/*
	This method is called by:
		* Components with 'emittable' events like input.onFocus
		* Wrapper for onMount, onUnmount
		* onKeyDown events (global as well as local)
*/

//Stores
import { eventSubscriptions } from '../stores/storeMisc';
import { getMappedFrom } from '../helpers/getMappedId';

//Exports

//When 'from' is undefined, the event will be global
const emitEvent = (from, event, msg) => {
	let consumed = false;

	eventSubscriptions.forEach(e => {
		if (e.event !== event)
			return;

		let eFrom = e.from;

		//Is it a scoped from
		if (eFrom?.indexOf('||') === 0)
			eFrom = getMappedFrom(e);

		const isMatch = (
			(
				from !== undefined &&
				from === eFrom
			) ||
			(
				from === undefined &&
				e.global &&
				event === e.event
			)
		);

		if (!isMatch)
			return;

		const result = e.handler(msg);
		if (!consumed)
			consumed = result;
	});

	return consumed;
};

export default emitEvent;
