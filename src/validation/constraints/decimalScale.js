import { isDecimal } from '../../system/helpers';

const getScaleOfValue = value => {
	if (Math.floor(value) === value)
		return 0;

	const split = value.toString().split('.');

	if (split.length === 1)
		return 0;

	return split[1].length || 0;
};

const handler = (value, cpt, { decimalScale, dataType, errorOverrides }) => {
	if (
		decimalScale === undefined ||
		value === undefined ||
		value === null ||
		value === '' ||
		dataType !== 'decimal'
	)
		return;

	if ((!isDecimal && decimalScale > 0) || getScaleOfValue(value) !== decimalScale)
		return errorOverrides.decimalScale || `${cpt} should be of decimal scale ${decimalScale}.`;
};

export const enforcer = ({ decimalScale }, value) => {
	let newValue = Number(value);
	newValue = newValue.toFixed(decimalScale);

	return newValue;
};

export default handler;
