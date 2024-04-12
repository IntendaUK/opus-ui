//System Helpers
import { clone } from '../../../system/helpers';

//Helpers
import applyComparison from './applyComparison';
import { setVariables } from './variableActions';
import morphConfig from '../helpers/morphConfig';

const findIndexInArray = (config, script, props) => {
	const { id, value, comparison, recordVarName = 'record', rowNumVarName = 'rowNum' } = config;

	const clonedScript = clone({}, script);
	if (id !== undefined)
		clonedScript.id = id;

	let i = 0;
	for (let v of value) {
		setVariables({
			variables: {
				[recordVarName]: v,
				[rowNumVarName]: i
			}
		}, clonedScript, props);

		const morphedComparison = morphConfig(comparison, clonedScript, props);

		const doesMatch = applyComparison(morphedComparison, clonedScript, props);

		if (doesMatch)
			return i;

		i++;
	}

	return -1;
};

export default findIndexInArray;
