import { test, expect, describe, it } from 'vitest';

import { enforcer } from '../../../../../validation/constraints/decimalScale';

const getValidatorResult = (value, decimalScale = 2) => {
	const result = enforcer({ decimalScale }, value);

	return result;
};

describe('Validation Enforcers: Decimal Scale', () => {
	it('Removes extra decimals from decimals', () => {
		const res = getValidatorResult('1.234', 2);
		expect(res).toEqual('1.23');
	});

	it('Does not mutate correct decimals', () => {
		const res = getValidatorResult('1.234', 3);
		expect(res).toEqual('1.234');
	});

	it('Does not mutate correct integers', () => {
		const res = getValidatorResult('1', 0);
		expect(res).toEqual('1');
	});

	it('Adds extra decimals to integers', () => {
		const res = getValidatorResult('1', 2);
		expect(res).toEqual('1.00');
	});

	it('Adds extra decimals to decimals', () => {
		const res = getValidatorResult('1.2', 2);
		expect(res).toEqual('1.20');
	});
});
