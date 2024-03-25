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
export const processAction = async (config, script, props, context) => {
	if (config.blueprint)
		await applyBlueprints(config);

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

	const { type, storeAsVariable, pushToVariable } = morphedConfig;

	const fn = actions[type] ?? actions.getExternalAction(type);

	let result;
	try {
		result = await fn(morphedConfig, script, props, context);

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
			//eslint-disable-next-line no-console
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
		} else {
			/* eslint-disable-next-line no-console */
			console.error('Script action crashed');
		}
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
export const processActionSync = (config, script, props, context) => {
	const morphedConfig = morphConfig(config, script, props);

	if (morphedConfig.log === true) {
		/* eslint-disable-next-line no-console */
		console.log(JSON.parse(JSON.stringify(morphedConfig)));
	}

	if (config.actionCondition && !shouldRunAction(props, config))
		return props.state.stopScriptString;

	const { type, storeAsVariable, pushToVariable } = morphedConfig;

	const fn = actions[type] ?? actions.getExternalAction(type);

	let result;

	try {
		result = fn(morphedConfig, script, props, context);

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
			//eslint-disable-next-line no-console
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
		} else {
			/* eslint-disable-next-line no-console */
			console.error('Script action crashed');
		}
	}

	return result;
};
