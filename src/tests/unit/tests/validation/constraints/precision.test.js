import { test, expect, describe, it } from 'vitest';

import fnPrecision from '../../../../../validation/constraints/precision';

const getValidatorResult = (value, precision = 5) => {
	const result = fnPrecision(value, 'cpt', {
		precision,
		errorOverrides: {}
	});

	return result;
};

describe('Validation Constraints: Precision', () => {
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

	it('Succeeds if a correct integer is provided', () => {
		const res = getValidatorResult(12345, 5);
		expect(res).toEqual(undefined);
	});

	it('Succeeds if a correct decimal is provided', () => {
		const res = getValidatorResult(123.45, 5);
		expect(res).toEqual(undefined);
	});

	it('Succeeds if a correct integer is provided as a string', () => {
		const res = getValidatorResult(12345, 5);
		expect(res).toEqual(undefined);
	});

	it('Succeeds if a correct decimal is provided as a string', () => {
		const res = getValidatorResult('123.45', 5);
		expect(res).toEqual(undefined);
	});

	it('Fails if a boolean value is provided', () => {
		const res = getValidatorResult(true);
		expect(res).toEqual(expect.any(String));
	});
});
