import { test, expect, describe, it } from 'vitest';

import { enforcer } from '../../../../../validation/constraints/minLength';

const getValidatorResult = (value, minLength = 2, padCharacter = '0', padAfter = true) => {
	const result = enforcer({
		minLength,
		padCharacter,
		padAfter
	}, value);

	return result;
};

describe('Validation Enforcers: Min Length', () => {
	it('Does not modify correct values', () => {
		const res = getValidatorResult('abc', 3);
		expect(res).toEqual('abc');
	});

	it('Adds extra characters in front of strings', () => {
		const res = getValidatorResult('a', 3, '0', false);
		expect(res).toEqual('00a');
	});

	it('Adds extra characters after strings', () => {
		const res = getValidatorResult('a', 3, '0', true);
		expect(res).toEqual('a00');
	});
});
