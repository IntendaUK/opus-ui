//System Helpers
import { clone } from '../../../system/helpers';

const spliceArray = config => {
	const { value, index, insertValue, removeCount = 0 } = config;

	const result = clone([], value);

	if (insertValue) {
		if (insertValue instanceof Array)
			result.splice(index, removeCount, ...insertValue);
		else
			result.splice(index, removeCount, insertValue);
	} else
		result.splice(index, removeCount);

	return result;
};

export default spliceArray;
