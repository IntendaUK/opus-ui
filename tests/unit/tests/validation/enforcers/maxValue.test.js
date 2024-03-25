import { enforcer } from '../../../../../src/validation/constraints/maxValue';

const getValidatorResult = (value, maxValue = 2) => {
	const result = enforcer({ maxValue }, value);

	return result;
};

describe('Validation Enforcers: Max Value', () => {
	it('Does not modify correct integers', () => {
		const res = getValidatorResult('2', 2);
		expect(res).toEqual('2');
	});

	it('Does not modify correct decimals', () => {
		const res = getValidatorResult('2.2', 2.2);
		expect(res).toEqual('2.2');
	});

	it('Incorrect values become correct values', () => {
		const res = getValidatorResult('2', 1.5);
		expect(res).toEqual('1.5');
	});
});
