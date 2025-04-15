/*
	This method is called by the onStateChange trigger when the trigger source is defined
		not through an id, but rather, through a tag.
*/

//System Helpers
import spliceWhere from '../../../helpers/spliceWhere';

//Stores
import { eventSubscriptions } from '../stores/storeMisc';

//Exports

const subscribeToTag = (fromTag, ownerId, handler, event) => {
	const sub = {
		fromTag,
		ownerId,
		event,
		handler
	};

	eventSubscriptions.push(sub);

	const unsub = () => spliceWhere(eventSubscriptions, l => l === sub);

	return unsub;
};

export default subscribeToTag;
