//System
import { stateManager } from '../../../system/managers/stateManager';

//Action
const getComponentIdsWithTag = ({ value }) => {
	const red = stateManager.getWgtIdsWithTag(value);

	return red;
};

export default getComponentIdsWithTag;
