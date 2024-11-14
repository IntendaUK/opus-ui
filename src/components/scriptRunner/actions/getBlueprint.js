//System
import { applyBlueprints } from '../../../system/managers/blueprintManager';

//Action
const result = ({ blueprintPath, blueprintPrps }) => {
	const blueprint = {
		blueprint: blueprintPath,
		blueprintPrps
	};

	applyBlueprints(blueprint);

	return blueprint;
};

export default result;
