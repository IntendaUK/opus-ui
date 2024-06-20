import { test, expect, describe, it } from 'vitest';

import { enforcer } from '../../../../../validation/constraints/maxWords';

const getValidatorResult = (value, maxWords = 2) => {
	const result = enforcer({ maxWords }, value);

	return result;
};

describe('Validation Enforcers: Max Words', () => {
	it('Does not modify correct strings', () => {
		const res = getValidatorResult('one two three', 3);
		expect(res).toEqual('one two three');
	});

	it('Trims extra words', () => {
		const res = getValidatorResult('one two three four', 3);
		expect(res).toEqual('one two three');
	});
});
