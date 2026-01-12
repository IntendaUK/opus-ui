//System
import opusConfig from '../../../config';

//System Helpers
import { applyBlueprints } from '../../../system/managers/blueprintManager';

//Helpers
import morphConfig from './morphConfig';

//Actions
import * as actions from '../actions';

const shouldRunAction = ({ actionCondition }, script, props) => {
	const { operator, source, key, value, compareValue, comparisons } = actionCondition;

	const shouldRun = actions.applyComparison({
		operator,
		source,
		key,
		value,
		compareValue,
		comparisons
	}, script, props);

	return shouldRun;
};

//Asynchronous Version
/* eslint-disable max-lines-per-function, complexity */
export const processAction = async (config, script, props) => {
	if (config.blueprint)
		applyBlueprints(config);

	let actionTrackers;
	if (opusConfig.env === 'development' && script.trackAction) {
		actionTrackers = {
			accessors: [],
			evalParameters: [],
			fnArgs: [],
			scopedIdLookups: []
		};
	}

	const morphedConfig = morphConfig(config, script, props, false, true, actionTrackers);

	if (morphedConfig.log === true) {
		/* eslint-disable-next-line no-console */
		console.log(JSON.parse(JSON.stringify(morphedConfig)));
	}

	if (config.actionCondition && !shouldRunAction(morphedConfig, script, props))
		return;

	const { type, storeAsVariable, pushToVariable, handler, isAsync } = morphedConfig;

	if (handler) {
		//We always drill one level into the suite's args
		if (morphedConfig.args)
			morphedConfig.args = morphConfig(morphedConfig.args, script, props, false, true, actionTrackers);

		const handlerResult = isAsync
			? await handler(morphedConfig, script, props)
			: handler(morphedConfig, script, props);

		return handlerResult;
	}

	const fn = actions.getExternalAction(type) ?? actions[type];

	let result;
	try {
		result = await fn(morphedConfig, script, props);

		if (opusConfig.env === 'development' && script.trackAction) {
			script.trackAction({
				scope: script.id,
				config,
				morphedConfig,
				actionTrackers,
				result,
				success: true
			});
		}
	} catch (e) {
		if (opusConfig.env === 'development') {
			console.error({
				msg: 'Script action crashed',
				error: e,
				args: {
					config: JSON.parse(JSON.stringify(morphedConfig)),
					scp: JSON.parse(JSON.stringify(script))
				}
			});

			if (script.trackAction) {
				script.trackAction({
					config,
					morphedConfig,
					result,
					success: false
				});
			}
		} else

			console.error('Script action crashed');
	}

	if (storeAsVariable) {
		actions.setVariable({
			name: storeAsVariable,
			value: result
		}, script, props);
	} else if (pushToVariable) {
		actions.pushVariable({
			name: pushToVariable,
			value: result
		}, script, props);
	}

	return result;
};

//Synchronous Version
// The reason we have this one is for propScripts (morphProps.js) since we do not support
// asynchronous scripts for calculating property values. That just lends to bad design
// in which we need to wait too long to see initial mounts.
export const processActionSync = (config, script, props) => {
	const morphedConfig = morphConfig(config, script, props);

	if (morphedConfig.log === true) {
		/* eslint-disable-next-line no-console */
		console.log(JSON.parse(JSON.stringify(morphedConfig)));
	}

	if (config.actionCondition && !shouldRunAction(props, config))
		return props.state.stopScriptString;

	const { type, storeAsVariable, pushToVariable, handler } = morphedConfig;
	if (handler)
		return handler(config, script, props);

	const fn = actions.getExternalAction(type) ?? actions[type];

	let result;

	try {
		result = fn(morphedConfig, script, props);

		if (opusConfig.env === 'development' && script.trackAction) {
			script.trackAction({
				config,
				morphedConfig,
				result,
				success: true
			});
		}

		if (storeAsVariable) {
			actions.setVariable({
				name: storeAsVariable,
				value: result
			}, script, props);
		} else if (pushToVariable) {
			actions.pushVariable({
				name: pushToVariable,
				value: result
			}, script, props);
		}
	} catch (e) {
		if (opusConfig.env === 'development') {
			console.error({
				msg: 'Script action crashed',
				error: e,
				args: {
					config: JSON.parse(JSON.stringify(morphedConfig)),
					scp: JSON.parse(JSON.stringify(script))
				}
			});

			if (script.trackAction) {
				script.trackAction({
					config,
					morphedConfig,
					result,
					success: false
				});
			}
		} else

			console.error('Script action crashed');
	}

	return result;
};
