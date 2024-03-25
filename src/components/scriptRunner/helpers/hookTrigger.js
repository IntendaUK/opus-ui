//System Helpers
import { applyBlueprints } from '../../../system/managers/blueprintManager';

//Helpers
import morphConfig from './morphConfig';
import { register as registerLateBound } from './lateBoundTriggers';

//Triggers
import * as triggers from '../triggers';

const hookTrigger = async (config, props, script, context) => {
	if (config.blueprint)
		await applyBlueprints(config);

	const morphedConfig = morphConfig(config, script, props);

	const { event, lateBound } = morphedConfig;

	if (lateBound) {
		registerLateBound({
			config: {
				...morphedConfig,
				source: config.source
			},
			props,
			script,
			context,
			boundTo: []
		});

		return;
	}

	const fn = triggers[event];

	return await fn(morphedConfig, props, script, context);
};

export default hookTrigger;
