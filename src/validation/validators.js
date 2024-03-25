import mandatory from './constraints/mandatory';
import regex from './constraints/regex';
import notRegex from './constraints/notRegex';
import maxLength, { enforcer as enforcerMaxLength } from './constraints/maxLength';
import minLength, { enforcer as enforcerMinLength } from './constraints/minLength';
import maxWords, { enforcer as enforcerMaxWords } from './constraints/maxWords';
import minWords from './constraints/minWords';
import maxValue, { enforcer as enforcerMaxValue } from './constraints/maxValue';
import minValue, { enforcer as enforcerMinValue } from './constraints/minValue';
import decimalScale, { enforcer as enforcerDecimalScale } from './constraints/decimalScale';
import precision, { enforcer as enforcerPrecision } from './constraints/precision';

export const validators = [
	['mandatory', mandatory],
	['regex', regex],
	['notRegex', notRegex],
	['maxLength', maxLength],
	['minLength', minLength],
	['maxWords', maxWords],
	['minWords', minWords],
	['maxValue', maxValue],
	['minValue', minValue],
	['decimalScale', decimalScale],
	['precision', precision]
];

export const enforcers = {
	maxLength: enforcerMaxLength,
	minLength: enforcerMinLength,
	maxWords: enforcerMaxWords,
	maxValue: enforcerMaxValue,
	minValue: enforcerMinValue,
	decimalScale: enforcerDecimalScale,
	precision: enforcerPrecision
};
