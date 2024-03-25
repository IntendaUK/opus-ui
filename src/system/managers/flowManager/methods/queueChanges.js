/*
	This method is called by:
		* Wrapper when mounting, to inform flows of the initial state of a component
		* StateManager whenever a component receives new state values
	In both of these cases, this method queues the changes to be processed as soon as the component
		informs the flowManager that said changes can be processed.
*/

//Stores
import { eventSubscriptions, queuedEvents } from '../stores/storeMisc';

//Helpers
import { getMappedFrom } from '../helpers/getMappedId';
import { isAnyoneListeningToSrcId, isAnyoneListeningToSrcTag } from '../stores/storeListeners';

//This function is in charge of checking whether a particular state change needs to be
// queued for processing. This can be because one of multiple reasons
const shouldQueueChanges = (id, fullState) => {
	//Are there any flows that are listening?
	const fromListenerExists = isAnyoneListeningToSrcId(id);
	if (fromListenerExists)
		return true;

	//Are there any triggers that are listening?
	// Some listeners have fromTag as their source, so we need to be sure to ignore them
	const fromTriggerExists = eventSubscriptions.some(flow => {
		const mappedId = getMappedFrom(flow);

		return mappedId === id;
	});
	if (fromTriggerExists)
		return true;

	if (!fullState.tags)
		return false;

	const tags = fullState.tags;

	//Are any flows listening to a tag defined on the source?
	const fromTagListenerExists = isAnyoneListeningToSrcTag(tags);
	if (fromTagListenerExists)
		return true;

	//Are any triggers listening to a tag defined on the source?
	const fromTagTriggerExists = eventSubscriptions.some(({ fromTag }) => tags.includes(fromTag));
	if (fromTagTriggerExists)
		return true;
};

const queueChanges = (id, changed, deleted = [], fullState) => {
	const shouldQueue = shouldQueueChanges(id, fullState);
	if (!shouldQueue)
		return;

	let queued = queuedEvents.find(q => q.id === id);

	if (!queued) {
		queued = {
			id,
			changed: {},
			deleted: []
		};

		queuedEvents.push(queued);
	}

	const { changed: qChanged, deleted: qDeleted } = queued;

	Object.entries(changed).forEach(([k, v]) => {
		qChanged[k] = v;
	});

	queued.full = fullState;

	deleted.forEach(d => qDeleted.push(d));
};

export default queueChanges;
