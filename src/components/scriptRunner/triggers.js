//System Helpers
import { subscribe as subscribeToEvent } from '../../system/managers/eventManager';
import { subscribe as subscribeToFlow,
	subscribeToTag } from '../../system/managers/flowManager/index';

//Helpers
import isMatch from './helpers/isMatch';
import initAndRunScript from './helpers/initAndRunScript';

//Triggers
export { default as onComponentChildrenChanged } from './triggers/onComponentChildrenChanged';
export { default as onComponentResized } from './triggers/onComponentResized';
export { default as onConnectionLost } from './triggers/onConnectionLost';
export { default as onConnectionRestored } from './triggers/onConnectionRestored';
export { default as onInterval } from './triggers/onInterval';
export { default as onMount } from './triggers/onMount';
export { default as onAllMounted } from './triggers/onAllMounted';
export { default as onPlatformCrash } from './triggers/onPlatformCrash';
export { default as onScrollComponent } from './triggers/onScrollComponent';
export { default as onUnmount } from './triggers/onUnmount';
export { default as onWindowResized } from './triggers/onWindowResized';

export {
	onKeyDown, onGlobalKeyDown, onGlobalKeyUp
} from './triggers/keyTriggers';

const subToTag = (morphedConfig, props, script, context) => {
	const { sourceTag, snapshotKeys, key = 'value', ignoreEmpty = true } = morphedConfig;

	const unsub = subscribeToTag(sourceTag, script.ownerId, msg => {
		const shouldContinue = isMatch(morphedConfig, props, msg, msg.full.id, script);

		if (!shouldContinue)
			return;

		if (typeof(msg) === 'undefined' || !msg.changed)
			return;

		const { [key]: value } = msg.changed;

		if (value === undefined || (ignoreEmpty && value === ''))
			return;

		initAndRunScript({
			script,
			props,
			context,
			snapshotKeys,
			triggerMsg: msg,
			setVariables: { triggeredFrom: msg.full.id },
			isRootScript: true
		});
	});

	return [unsub];
};

export const onStateChange = (config, props, script, context) => {
	const { source = script.ownerId, sourceList, sourceTag } = config;
	const { key = 'value', keyList = [ key ], ignoreEmpty = true, snapshotKeys } = config;

	if (sourceTag)
		return subToTag(config, props, script, context);

	const sourceIds = sourceList ?? [ source ];

	const unsubs = sourceIds.map(s => {
		return keyList.map(k => {
			const unsub = subscribeToFlow(s, script.ownerId, msg => {
				const shouldContinue = isMatch(config, props, msg, s, script);

				if (!shouldContinue)
					return;

				if (typeof(msg) === 'undefined' || !msg.changed)
					return;

				const { [k]: value } = msg.changed;

				if (value === undefined || (ignoreEmpty && value === ''))
					return;

				initAndRunScript({
					script,
					props,
					context,
					snapshotKeys,
					triggerMsg: msg,
					setVariables: { triggeredFrom: msg.full.id },
					isRootScript: true
				});
			});

			return unsub;
		});
	}).flat();

	return unsubs;
};

const onEvent = (config, props, script, context) => {
	const { source = script.ownerId, event, snapshotKeys } = config;

	const handler = msg => {
		initAndRunScript({
			script,
			props,
			context,
			snapshotKeys,
			triggerMsg: msg,
			setVariables: { triggeredFrom: source },
			isRootScript: true
		});
	};

	return subscribeToEvent(event, source, script.ownerId, handler);
};

export const onFocus = onEvent;
export const onBlur = onEvent;
export const onSelect = onEvent;

