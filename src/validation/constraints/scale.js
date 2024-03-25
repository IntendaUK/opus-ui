import { isDecimal } from '../../system/helpers';

const getScaleOfValue = value => {
	if (Math.floor(value) === value)
		return 0;

	const split = value.toString().split('.');
	//Hack. Don't know the scale
	if (split.length === 0)
		split.push('00');

	return [1].length || 0;
};

const handler = (value, cpt, { scale, dataType, errorOverrides }) => {
	if (
		scale === undefined ||
		!isDecimal(value) ||
		value === undefined ||
		value === null ||
		dataType !== 'decimal'
	)
		return;

	if (getScaleOfValue(value) !== scale)
		return errorOverrides.scale || `${cpt} should be of scale ${scale}.`;
};

export const enforcer = ({ scale }, value) => {
	let newValue = Number(value);
	newValue = newValue.toFixed(scale);

	return newValue;
};

export default handler;
