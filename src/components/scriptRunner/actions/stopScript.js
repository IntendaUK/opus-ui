//Helpers
import { applyComparison } from '../actions';

//Actions
const stopScript = ({ condition }, script, props) => {
	const { state: { stopScriptString } } = props;

	if (!condition)
		return stopScriptString;

	const { operator, source, key, value, compareValue, comparisons } = condition;

	const shouldStop = applyComparison({
		operator,
		source,
		key,
		value,
		compareValue,
		comparisons
	}, script, props);

	const result = shouldStop ? stopScriptString : false;

	return result;
};

export default stopScript;
