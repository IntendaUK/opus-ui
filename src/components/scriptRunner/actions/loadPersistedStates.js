//System Helpers
import { getPersistedStates } from '../../../system/managers/propertyManager';
import createFlow from './createFlow';

//Action
//Config is an array of ids that should have their persisted states (of all scopes) loaded
const loadPersistedStates = ({ config }, script, props) => {
	const { ownerId } = script;

	config.forEach(id => {
		if (id === 'self')
			id = ownerId;

		const states = getPersistedStates(id);
		if (!states)
			return;

		states.forEach(({ key, subKey, value }) => {
			const flowConfig = {
				to: id,
				toKey: key,
				toSubKey: subKey,
				value
			};

			createFlow(flowConfig, script, props);
		});
	});
};

export default loadPersistedStates;
