//System Helpers
import { subscribe as subscribeToEvent,
	subscribeGlobal as subscribeToGlobalEvent } from '../../../system/managers/eventManager';
import { clone } from '../../../system/helpers';

//Helpers
import isMatch from '../helpers/isMatch';
import initAndRunScript from '../helpers/initAndRunScript';

const transforms = {
	'((event.keyCode))': 'keyCode',
	'((event.key))': 'key',
	'((event.shiftDown))': 'shiftKey',
	'((event.ctrlDown))': 'ctrlKey',
	'((event.altDown))': 'altKey'
};

const recurseTransformMatch = (match, e) => {
	Object.entries(match).forEach(([k, v]) => {
		if (typeof(v) === 'object' && v !== null) {
			recurseTransformMatch(v, e);

			return;
		}

		const transformKey = transforms[v];
		if (transformKey !== undefined)
			match[k] = e[transformKey];
	});
};

const shouldFire = (config, props, script, e) => {
	const { source = script.ownerId, match, matchEvaluation } = config;

	if (match) {
		const clonedMatch = clone([], match);

		recurseTransformMatch(clonedMatch, e);

		const transformedMatch = clonedMatch.map(
			({ operator, comparison, value, compareValue, source: innerSource, key, comparisons }) => {
				const result = {
					operator: operator ?? comparison,
					value,
					compareValue,
					source: innerSource,
					key,
					comparisons
				};

				const transformKey = transforms[result.value];
				if (transformKey !== undefined)
					result.value = e[transformKey];

				return result;
			}
		);

		const matchConfig = {
			matchEvaluation,
			match: transformedMatch
		};

		const shouldContinue = isMatch(matchConfig, props, null, source, script);
		if (!shouldContinue)
			return false;
	}

	return true;
};

//Triggers
export const onKeyDown = (config, props, script) => {
	const { source = script.ownerId, consumeEventOnUse = false } = config;

	const unsubs = subscribeToEvent('onKeyDown', source, script.ownerId, e => {
		if (!shouldFire(config, props, script, e))
			return false;

		initAndRunScript({
			script,
			props,
			setVariables: {
				triggeredKey: e.key,
				triggeredKeyCode: e.keyCode
			},
			isRootScript: true
		});

		return consumeEventOnUse;
	});

	return unsubs;
};

export const onGlobalKeyDown = (config, props, script) => {
	const consumeEventOnUse = config.consumeEventOnUse ?? false;

	const unsubs = subscribeToGlobalEvent('onGlobalKeyDown', script.ownerId, e => {
		if (!shouldFire(config, props, script, e))
			return false;

		initAndRunScript({
			script,
			props,
			setVariables: {
				triggeredKey: e.key,
				triggeredKeyCode: e.keyCode
			},
			isRootScript: true
		});

		return consumeEventOnUse;
	});

	return unsubs;
};

export const onGlobalKeyUp = (config, props, script) => {
	const consumeEventOnUse = config.consumeEventOnUse ?? false;

	const unsubs = subscribeToGlobalEvent('onGlobalKeyUp', script.ownerId, e => {
		if (!shouldFire(config, props, script, e))
			return false;

		initAndRunScript({
			script,
			props,
			setVariables: {
				triggeredKey: e.key,
				triggeredKeyCode: e.keyCode
			},
			isRootScript: true
		});

		return consumeEventOnUse;
	});

	return unsubs;
};
