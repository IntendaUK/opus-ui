import { test, expect, describe, it } from 'vitest';

import fnMaxWords from '../../../../../validation/constraints/maxWords';

const getValidatorResult = (value, maxWords = 2) => {
	const result = fnMaxWords(value, 'cpt', {
		maxWords,
		errorOverrides: {}
	});

	return result;
};

describe('Validation Constraints: Max Words', () => {
	it('Succeeds if a number is provided', () => {
		const res = getValidatorResult(1);
		expect(res).toEqual(undefined);
	});

	it('Succeeds if a boolean value is provided', () => {
		const res = getValidatorResult(true);
		expect(res).toEqual(undefined);
	});

	it('Succeeds if a string with few enough words is provided', () => {
		const res = getValidatorResult('one two');
		expect(res).toEqual(undefined);
	});

	it('Succeeds if a string with few enough words plus padding spaces is provided', () => {
		const res = getValidatorResult(' one two ');
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

	it('Succeeds if an empty string is provided', () => {
		const res = getValidatorResult('');
		expect(res).toEqual(undefined);
	});

	it('Fails if too many words are provided', () => {
		const res = getValidatorResult('one two three');
		expect(res).toEqual(expect.any(String));
	});
});
