//System Helpers
import { persistState } from '../../../system/managers/propertyManager';

//Action
//Config: [ { id, key, !subKey, !scope } ]
//Scope: 'session', '*' or 'some id'
const persistStates = ({ config }, { ownerId }, { getWgtState }) => {
	config.forEach(({ id = ownerId, key = 'value', subKey, scope = 'session' }) => {
		let value = getWgtState(id)[key];
		if (value === undefined)
			return;

		if (subKey)
			value = value[subKey];

		if (value === undefined)
			return;

		persistState(id, key, subKey, value, scope);
	});
};

export default persistStates;
