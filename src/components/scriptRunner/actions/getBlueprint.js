//System
import { applyBlueprints } from '../../../system/managers/blueprintManager';

//Action
const result = async ({ blueprintPath, blueprintPrps }) => {
	const blueprint = {
		blueprint: blueprintPath,
		blueprintPrps
	};

	await applyBlueprints(blueprint);

	return blueprint;
};

export default result;
