import { test, expect, describe, it } from 'vitest';

import fnDecimalScale from '../../../../../validation/constraints/decimalScale';

const getValidatorResult = (value, decimalScale = 2) => {
	const result = fnDecimalScale(value, 'cpt', {
		dataType: 'decimal',
		decimalScale,
		errorOverrides: {}
	});

	return result;
};

describe('Validation Constraints: Decimal Scale', () => {
	it('Succeeds if an empty string is provided', () => {
		const res = getValidatorResult('');
		expect(res).toEqual(undefined);
	});

	it('Succeeds if null is provided', () => {
		const res = getValidatorResult(null);
		expect(res).toEqual(undefined);
	});

	it('Succeeds if undefined is provided', () => {
		const res = getValidatorResult(undefined);
		expect(res).toEqual(undefined);
	});

	it('Succeeds if an integer is provided when decimal scale is 0', () => {
		const res = getValidatorResult(2, 0);
		expect(res).toEqual(undefined);
	});

	it('Succeeds if an integer is provided as a string when decimal scale is 0', () => {
		const res = getValidatorResult('2', 0);
		expect(res).toEqual(undefined);
	});

	it('Succeeds if a correct decimal is provided when decimal scale > 0', () => {
		const res = getValidatorResult(2.1, 1);
		expect(res).toEqual(undefined);
	});

	it('Succeeds if a correct decimal as a string is provided when decimal scale > 0', () => {
		const res = getValidatorResult('2.1', 1);
		expect(res).toEqual(undefined);
	});

	it('Fails if an integer is provided when decimal scale > 0', () => {
		const res = getValidatorResult(2, 1);
		expect(res).toEqual(expect.any(String));
	});

	it('Fails if an integer is provided as a string when decimal scale > 0', () => {
		const res = getValidatorResult('2', 1);
		expect(res).toEqual(expect.any(String));
	});

	it('Fails if a correct decimal is provided when decimal scale is 0', () => {
		const res = getValidatorResult(2.1, 0);
		expect(res).toEqual(expect.any(String));
	});

	it('Fails if a correct decimal as a string is provided when decimal scale is 0', () => {
		const res = getValidatorResult('2.1', 0);
		expect(res).toEqual(expect.any(String));
	});

	it('Fails if a boolean value is provided', () => {
		const res = getValidatorResult(true);
		expect(res).toEqual(expect.any(String));
	});
});
