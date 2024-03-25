/*
	This method is called right after every internal component state change. That is,
		if a component gets new state values, it will queue changes (to be processed by flows)
		and then, finally, allow flowMananger to fire off any flows that those changes might
		have caused.
*/

//Helpers
import { queuedEvents } from '../stores/storeMisc';

//Methods
import emit from './emit';

//Exports
const processQueue = id => {
	const queued = queuedEvents.find(q => q.id === id);
	if (!queued)
		return;

	emit(id, queued);

	queuedEvents.spliceWhere(q => q === queued);
};

export default processQueue;
