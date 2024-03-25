//Helpers
import morphConfig from './morphConfig';

//Actions
import { applyComparison } from '../actions';

//Internal
const arrayFns = {
	all: 'every',
	some: 'some',
	none: 'none'
};

//Helper
const isMatch = (triggerConfig, props, msg, sourceId, script) => {
	const { matchEvaluation = 'all', match = [] } = triggerConfig;
	const morphedMatches = match.map(m => morphConfig(m, script, props));

	const arrayFn = arrayFns[matchEvaluation];

	const result = morphedMatches[arrayFn](({
		comparison,
		comparisons,
		operator,
		source = sourceId,
		key,
		value,
		compareValue: bValue,
		compareOldValue
	}) => {
		let compareValue = bValue;
		if (compareOldValue)
			compareValue = msg.full[key];

		if (comparisons !== undefined)
			source = undefined;

		const doesMatch = applyComparison({
			operator: comparison ?? operator,
			source,
			key,
			value,
			compareValue,
			comparisons
		}, script, props);

		return doesMatch;
	});

	return result;
};

export default isMatch;
