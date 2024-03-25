const handler = (value, cpt, { maxValue, errorOverrides }) => {
	if (
		maxValue === undefined ||
		value === undefined ||
		value === null
	)
		return;

	let valueAsNumber = Number(value);

	if (isNaN(valueAsNumber))
		return;

	if (valueAsNumber > maxValue)
		return errorOverrides.maxValue || `${cpt} may not be larger than ${maxValue}.`;
};

export const enforcer = ({ maxValue }) => {
	return maxValue + '';
};

export default handler;
