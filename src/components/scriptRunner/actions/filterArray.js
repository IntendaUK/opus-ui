//System Helpers
import { clone } from '../../../system/helpers';

//Helpers
import applyComparison from './applyComparison';
import { setVariables } from './variableActions';
import morphConfig from '../helpers/morphConfig';

const filterArray = (config, script, props) => {
	const { id, value, condition, recordVarName = 'record', rowNumVarName = 'rowNum' } = config;

	const clonedScript = clone({}, script);
	if (id !== undefined)
		clonedScript.id = id;

	const result = [];

	let i = 0;
	for (let v of value) {
		setVariables({
			variables: {
				[recordVarName]: v,
				[rowNumVarName]: i
			}
		}, clonedScript, props);

		const morphedCondition = morphConfig(condition, clonedScript, props);

		const doesMatch = applyComparison(morphedCondition, clonedScript, props);

		if (doesMatch)
			result.push(v);

		i++;
	}

	return result;
};

export default filterArray;
