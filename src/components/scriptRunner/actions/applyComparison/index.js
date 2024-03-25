import * as comparisons from './comparisons';

let extraComparisons = {};

const applyComparison = (config, script, props) => {
	const { operator, value, compareValue, key } = config;

	let source = config.source;
	if (!value && !source)
		source = config.ownerId;

	let aValue = value;
	if (source && aValue === undefined) {
		const state = props.getWgtState(source);
		if (!state)
			return false;

		const stateValue = state[key];
		if (stateValue === undefined)
			return false;

		aValue = stateValue;
	}

	const extra = extraComparisons[operator];
	if (extra)
		return extra(config, script, props, aValue);

	const fn = comparisons[operator];

	return fn(aValue, compareValue);
};

Object.assign(extraComparisons, {
	all: (config, script, props) => {
		const result = !config.comparisons.some(c => !applyComparison(c, script, props));

		return result;
	},

	some: (config, script, props) => {
		const result = config.comparisons.some(c => applyComparison(c, script, props));

		return result;
	},

	none: (config, script, props) => {
		const result = !config.comparisons.some(c => applyComparison(c, script, props));

		return result;
	},

	case: (config, script, props, aValue) => {
		return aValue;
	},

	//fields: ['id1', 'id2', ...]
	doFieldsHaveValues: ({ fields }, script, { getWgtState }) => {
		const foundFieldWithValue = fields.some(fieldId => {
			const state = getWgtState(fieldId);

			if (!state)
				return false;

			const value = state.value;

			const hasValue = value !== undefined && value !== '';

			return hasValue;
		});

		return foundFieldWithValue;
	},

	//values: [{key, value}, ...]
	doValuesDifferFromRecord: ({ values, record }) => {
		if (!record)
			return;

		const foundValueThatDiffers = values.some(({ key, value }) => {
			const differs = value !== record[key];

			return differs;
		});

		return foundValueThatDiffers;
	}
});

export default applyComparison;
