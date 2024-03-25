//System Helpers
import { clone } from '../../../helpers';

//Recurses through a mapObject and injects a flow value into a key or value
// when it finds ((value))
const recurseMapObject = (mapObject, value) => {
	const res = mapObject instanceof Array ? [] : {};

	clone(res, mapObject);

	const entries = Object.entries(res);

	entries.forEach(([k, v]) => {
		if (k === '((value))') {
			delete res[k];
			res[value] = v;
		} else if (v === '((value))')
			res[k] = value;

		if (v instanceof Array || typeof(v) === 'object')
			res[k] = recurseMapObject(v, value);
	});

	return res;
};

const getMappedValue = ({ ignoreEmptyString, mapObject, mapFunction, setter }, value, fullState) => {
	let newValue = value;

	if (mapObject)
		newValue = recurseMapObject(mapObject, value);
	else if (mapFunction)
		newValue = mapFunction(value, fullState);

	const ignoreValue = (
		newValue === undefined ||
		(
			ignoreEmptyString &&
			(
				(
					mapObject &&
					value === ''
				) ||
				(
					!mapObject &&
					newValue === ''
				)
			)
		)
	);

	if (ignoreValue)
		return undefined;

	return newValue;
};

export default getMappedValue;
