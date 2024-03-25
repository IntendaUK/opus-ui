import { isDecimal } from '../../system/helpers';

const getPrecisionOfValue = value => {
	const number = Math.floor(value).toString();
	let decimal = '';

	if (isDecimal(value))
		decimal = (value + '').split('.')[1];

	const precision = (number + decimal).length;

	return precision;
};

const handler = (value, cpt, { precision, errorOverrides }) => {
	if (
		precision === undefined ||
		value === undefined ||
		value === null ||
		value === '' ||
		!isFinite(value)
	)
		return;

	if (getPrecisionOfValue(value) !== precision)
		return errorOverrides.precision || `${cpt} should be of precision ${precision}.`;
};

export const enforcer = ({ precision, padCharacter, padAfter }, value) => {
	if (!value)
		return '';

	let newValue = value + '';

	const hasDecimal = newValue.includes('.');
	if (hasDecimal) {
		newValue = newValue
			.padStart(precision + 1, padAfter ? '' : padCharacter)
			.padEnd(precision + 1, padAfter ? padCharacter : '')
			.substr(0, precision + 1);
	} else {
		newValue = newValue
			.padStart(precision, padAfter ? '' : padCharacter)
			.padEnd(precision, padAfter ? padCharacter : '')
			.substr(0, precision);
	}

	return newValue;
};

export default handler;
