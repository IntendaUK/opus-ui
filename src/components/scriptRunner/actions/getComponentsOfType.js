//System
import { stateManager } from '../../../system/managers/stateManager';

//Action
const getComponentsOfType = ({ componentType }) => {
	const res = stateManager.getComponentsOfType(componentType);

	return res;
};

export default getComponentsOfType;
