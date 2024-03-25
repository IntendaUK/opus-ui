const convertUndefinedToNullReplacer = (key, value) => {
	return value === undefined ? null : value;
};

export const stringify = ({ value, spacer, convertUndefinedToNull = false }) => {
	let replacer = null;

	if (convertUndefinedToNull)
		replacer = convertUndefinedToNullReplacer;

	return JSON.stringify(value, replacer, spacer);
};

export default stringify;
