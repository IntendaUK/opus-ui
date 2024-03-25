//System Helpers
import { clone } from '../../../system/helpers';

//Helpers
import { setVariables } from '../actions';
import morphConfig, { getMorphedValue } from '../helpers/morphConfig';

const mapArray = (config, script, props) => {
	const { id, value, mapTo, recordVarName = 'record', rowNumVarName = 'rowNum' } = config;

	const clonedScript = clone({}, script);
	if (id !== undefined)
		clonedScript.id = id;

	const result = [];

	const isPrimitive = typeof mapTo === 'string';

	let i = 0;
	for (let v of value) {
		setVariables({
			variables: {
				[recordVarName]: v,
				[rowNumVarName]: i
			}
		}, clonedScript, props);

		let morphedValue = null;

		if (isPrimitive)
			morphedValue = getMorphedValue(mapTo, clonedScript, props);
		else {
			const mappedObject = clone({}, mapTo);
			morphedValue = morphConfig(mappedObject, clonedScript, props);
		}

		result.push(morphedValue);

		i++;
	}

	return result;
};

export default mapArray;
