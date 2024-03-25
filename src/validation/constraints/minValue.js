const handler = (value, cpt, { minValue, errorOverrides }) => {
	if (
		minValue === undefined ||
		value === undefined ||
		value === null ||
		value === ''
	)
		return;

	let valueAsNumber = Number(value);

	if (isNaN(valueAsNumber))
		return;

	if (valueAsNumber < minValue)
		return errorOverrides.minValue || `${cpt} may not be less than ${minValue}.`;
};

export const enforcer = ({ minValue }) => {
	return minValue + '';
};

export default handler;
