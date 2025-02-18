//Helpers
import applyComparison from './applyComparison';
import morphConfig from '../helpers/morphConfig';

const waitForCondition = async (config, script, props) => {
	const { condition, intervalInMs = 300 } = config;

	await new Promise(res => {
		const checkResult = () => {
			const morphedCondition = morphConfig(condition, script, props);

			const { operator, source, key, value, compareValue, comparisons } = morphedCondition;

			const conditionMet = applyComparison({
				operator,
				source,
				key,
				value,
				compareValue,
				comparisons
			}, script, props);

			if (!conditionMet) {
				setTimeout(checkResult, intervalInMs);

				return;
			}

			res();
		};

		checkResult();
	});
};

export default waitForCondition;
