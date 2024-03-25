//System
import { stateManager } from '../../../system/managers/stateManager';

//External Helpers
import applyComparison from './applyComparison';

//Helpers
const getResultAll = (stateComparisons, script, props) => {
	const result = !stateComparisons.some(s => {
		const innerFailed = s.some(c => {
			const innerResult = !applyComparison(c, script, props);

			return innerResult;
		});

		return innerFailed;
	});

	return result;
};

const getResultSome = (stateComparisons, script, props) => {
	const result = stateComparisons.some(s => {
		const innerFailed = s.some(c => {
			const innerResult = applyComparison(c, script, props);

			return innerResult;
		});

		return innerFailed;
	});

	return result;
};

const getResultNone = (stateComparisons, script, props) => {
	const result = stateComparisons.some(s => {
		const innerFailed = s.some(c => {
			const innerResult = !applyComparison(c, script, props);

			return innerResult;
		});

		return innerFailed;
	});

	return result;
};

const operatorFn = {
	all: getResultAll,
	some: getResultSome,
	none: getResultNone
};

//Action
const allCpsHaveStates = (config, script, props) => {
	const { sourceTag, sourceList, operator, comparisons } = config;

	let states = null;
	if (sourceTag)
		states = stateManager.getWgtStatesWithTag(sourceTag);
	else if (sourceList) {
		states = sourceList.map(id => {
			const state = stateManager.getWgtState(id) ?? {};

			return state;
		});
	}

	const comparisonConfigs = states.map(s => {
		const configs = comparisons.map(c => {
			const res = {
				operator: c.operator,
				value: s[c.key],
				compareValue: c.compareValue
			};

			return res;
		});

		return configs;
	});

	const result = operatorFn[operator](comparisonConfigs, script, props);

	return result;
};

export default allCpsHaveStates;
