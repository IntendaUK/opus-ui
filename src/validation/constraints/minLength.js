const handler = (value, cpt, { minLength, errorOverrides }) => {
	if (minLength === undefined || value === undefined || value === null)
		return;

	let useValue = value;

	if (typeof(value) !== 'string')
		useValue = value + '';

	if (useValue.length < minLength)
		return errorOverrides.minLength || `${cpt} may not be shorter than ${minLength} characters.`;
};

export const enforcer = ({ minLength, padCharacter, padAfter }, value) => {
	if (!padCharacter)
		return;

	const numberOfCharsToAdd = minLength - value.length;
	const addString = padCharacter.repeat(numberOfCharsToAdd);

	const newValue = `${padAfter ? '' : addString}${value}${padAfter ? addString : ''}`;

	return newValue;
};

export default handler;
