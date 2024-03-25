/*
	This method is called when queued state changes are processed as well as for createFlow actions
*/

//System
import { stateManager } from '../../stateManager';
import { getScopedId } from '../../scopeManager';
import opusConfig from '../../../../config';

//Helpers
import { getMappedTo } from '../helpers/getMappedId';
import { eventSubscriptions } from '../stores/storeMisc';
import applyListenerStates from '../helpers/applyListenerStates';
import { alertListenersOfChanges, alertListenersOfDeletions } from '../stores/storeListeners';

//Helpers
const processDeleted = (from, deleted, targetStates) => {
	const deletedListeners = alertListenersOfDeletions(from, deleted);

	deletedListeners.forEach(listener => {
		const to = getMappedTo(listener);
		const { toKey, previousValue } = listener;

		if (!targetStates[to])
			targetStates[to] = {};

		if (!targetStates[to].deleteKeys)
			targetStates[to].deleteKeys = [];

		const deleteKey = {
			key: toKey,
			value: previousValue
		};

		targetStates[to].deleteKeys.push(deleteKey);
	});
};

const notifySubscriptions = (from, msg) => {
	const { full } = msg;

	eventSubscriptions.forEach(({ from: eFrom, ownerId, event, fromTag, handler }) => {
		if (event)
			return;

		let isMatch = false;

		if (eFrom !== undefined) {
			isMatch = (
				eFrom === from ||
				(
					eFrom.indexOf('||') === 0 &&
					getScopedId(eFrom, ownerId) === from
				)
			);
		} else if (fromTag !== undefined)
			isMatch = full?.tags.includes(fromTag);

		if (isMatch)
			handler(msg);
	});
};

//Export
const emit = (from, msg) => {
	const { changed, deleted, full } = msg;

	const changedListeners = alertListenersOfChanges(from, changed, full);

	const targetStates = {};

	applyListenerStates(targetStates, changedListeners);

	if (deleted)
		processDeleted(from, deleted, targetStates);

	Object.entries(targetStates).forEach(([to, newState]) => {
		if (opusConfig.env === 'development') {
			stateManager.setWgtState(to, newState, {
				id: from,
				type: 'flow'
			});
		} else
			stateManager.setWgtState(to, newState);
	});

	notifySubscriptions(from, msg);
};

export default emit;
