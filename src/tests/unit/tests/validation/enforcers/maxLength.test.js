import { test, expect, describe, it } from 'vitest';

import { enforcer } from '../../../../../validation/constraints/maxLength';

const getValidatorResult = (value, maxLength = 2) => {
	const result = enforcer({ maxLength }, value);

	return result;
};

describe('Validation Enforcers: Max Length', () => {
	it('Removes extra characters from strings', () => {
		const res = getValidatorResult('abc', 2);
		expect(res).toEqual('ab');
	});

	it('Does not mutate correct values', () => {
		const res = getValidatorResult('abc', 3);
		expect(res).toEqual('abc');
	});
});
