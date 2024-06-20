import { test, expect, describe, it } from 'vitest';

import { enforcer } from '../../../../../validation/constraints/precision';

const getValidatorResult = (value, precision, padCharacter, padAfter) => {
	const result = enforcer({
		precision,
		padCharacter,
		padAfter
	}, value);

	return result;
};

describe('Validation Enforcers: Precision', () => {
	it('Does not modify correct strings', () => {
		const res = getValidatorResult('abcde', 5);
		expect(res).toEqual('abcde');
	});

	it('Does not modify correct integers', () => {
		const res = getValidatorResult('12345', 5);
		expect(res).toEqual('12345');
	});

	it('Does not modify correct decimals', () => {
		const res = getValidatorResult('123.45', 5);
		expect(res).toEqual('123.45');
	});

	it('Adds padding characters before integers', () => {
		const res = getValidatorResult('123', 5, '0', false);
		expect(res).toEqual('00123');
	});

	it('Adds padding characters after integers', () => {
		const res = getValidatorResult('123', 5, '0', true);
		expect(res).toEqual('12300');
	});

	it('Adds padding characters before integers', () => {
		const res = getValidatorResult('12.3', 5, '0', false);
		expect(res).toEqual('0012.3');
	});

	it('Adds padding characters after integers', () => {
		const res = getValidatorResult('12.3', 5, '0', true);
		expect(res).toEqual('12.300');
	});
});
