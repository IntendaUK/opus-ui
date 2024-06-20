import { test, expect, describe, it } from 'vitest';

import fnMaxLength from '../../../../../validation/constraints/maxLength';

const getValidatorResult = (value, maxLength = 2) => {
	const result = fnMaxLength(value, 'cpt', {
		maxLength,
		errorOverrides: {}
	});

	return result;
};

describe('Validation Constraints: Max Length', () => {
	it('Succeeds if a short enough string is provided', () => {
		const res = getValidatorResult('a');
		expect(res).toEqual(undefined);
	});

	it('Succeeds if a short enough number is provided', () => {
		const res = getValidatorResult(1);
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

	it('Fails if too long of a string is provided', () => {
		const res = getValidatorResult('abc');
		expect(res).toEqual(expect.any(String));
	});

	it('Fails if too long of a number is provided', () => {
		const res = getValidatorResult(123);
		expect(res).toEqual(expect.any(String));
	});
});
