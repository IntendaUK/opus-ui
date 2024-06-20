import { test, expect, describe, it } from 'vitest';

import fnMinWords from '../../../../../validation/constraints/minWords';

const getValidatorResult = (value, minWords = 2) => {
	const result = fnMinWords(value, 'cpt', {
		minWords,
		errorOverrides: {}
	});

	return result;
};

describe('Validation Constraints: Min Words', () => {
	it('Succeeds if a number is provided if the minWords equals 1', () => {
		const res = getValidatorResult(1, 1);
		expect(res).toEqual(undefined);
	});

	it('Fails if a number is provided if the minWords > 1', () => {
		const res = getValidatorResult(1, 2);
		expect(res).toEqual(expect.any(String));
	});

	it('Succeeds if a boolean value is provided if the minWords equals 1', () => {
		const res = getValidatorResult(true, 1);
		expect(res).toEqual(undefined);
	});

	it('Fails if a boolean value is provided if the minWords > 1', () => {
		const res = getValidatorResult(true, 2);
		expect(res).toEqual(expect.any(String));
	});

	it('Succeeds if a string with enough words is provided', () => {
		const res = getValidatorResult('one two');
		expect(res).toEqual(undefined);
	});

	it('Succeeds if a string with enough words plus padding spaces is provided', () => {
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

	it('Fails if an empty string is provided', () => {
		const res = getValidatorResult('');
		expect(res).toEqual(expect.any(String));
	});

	it('Fails if too few words are provided', () => {
		const res = getValidatorResult('one');
		expect(res).toEqual(expect.any(String));
	});

	it('Fails if too few words plus padding spaces is provided', () => {
		const res = getValidatorResult(' one ');
		expect(res).toEqual(expect.any(String));
	});
});
