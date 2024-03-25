//System
import opusConfig from '../../../config';

//System Helpers
import { stateManager } from '../../../system/managers/stateManager';

const setTagState = (config, script, { setWgtState }) => {
	const { target, key = 'value', value } = config;

	const ids = stateManager.getWgtIdsWithTag(target);

	ids.forEach(i => {
		if (opusConfig.env === 'development') {
			setWgtState(i, { [key]: value }, {
				id: script.ownerId,
				type: 'script.setTagState'
			});
		} else
			setWgtState(i, { [key]: value });
	});
};

export default setTagState;
