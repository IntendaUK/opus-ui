//System Helpers
import { getDeepProperty } from '../../../system/helpers';

//Action
const reductions = {
	add: (reductionConfig, result, entry) => {
		result += +entry;

		return result;
	},

	concatenate: ({ delimiter = '' }, result, entry, isLastEntry) => {
		result += '' + entry;

		if (!isLastEntry)
			result += delimiter;

		return result;
	}
};

const reduceArray = config => {
	let { value, initialValue, field, reduction } = config;

	let fnReduction = reductions[reduction];

	if (typeof reduction === 'object')
		fnReduction = reductions[reduction.type];

	let result = initialValue;
	const length = value.length;

	value.forEach((v, i) => {
		const entry = field ? getDeepProperty(v, field) : v;

		const isLastEntry = i === length - 1;

		result = fnReduction(reduction, result, entry, isLastEntry);
	});

	return result;
};

export default reduceArray;
