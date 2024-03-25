//System Helpers
import { removePersistedStates } from '../../../system/managers/propertyManager';

//Action
//config is an array of ids that should have their persisted states (of all scopes) cleared
const clearPersistedStates = ({ config }, { ownerId }) => {
	config.forEach(id => {
		if (id === 'self')
			id = ownerId;

		removePersistedStates(id);
	});
};

export default clearPersistedStates;
