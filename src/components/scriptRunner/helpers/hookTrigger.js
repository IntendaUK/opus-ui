//System Helpers
import { applyBlueprints } from '../../../system/managers/blueprintManager';

//Helpers
import morphConfig from './morphConfig';
import { register as registerLateBound } from './lateBoundTriggers';

//Triggers
import * as triggers from '../triggers';

const hookTrigger = async (config, props, script) => {
	if (config.blueprint)
		applyBlueprints(config);

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
			boundTo: []
		});

		return;
	}

	const fn = triggers[event];

	return await fn(morphedConfig, props, script);
};

export default hookTrigger;
