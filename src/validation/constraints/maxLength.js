const handler = (value, cpt, { maxLength, errorOverrides }) => {
	if (maxLength === undefined || value === undefined || value === null)
		return;

	let useValue = value;

	if (typeof(value) !== 'string')
		useValue = value + '';

	if (useValue.length > maxLength)
		return errorOverrides.maxLength || `${cpt} may not be longer than ${maxLength} characters.`;
};

export const enforcer = ({ maxLength }, value) => {
	const newValue = value.substring(0, maxLength);

	return newValue;
};

export default handler;
