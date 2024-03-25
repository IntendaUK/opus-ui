import { enforcer } from '../../../../../src/validation/constraints/minValue';

const getValidatorResult = (value, minValue = 2) => {
	const result = enforcer({ minValue }, value);

	return result;
};

describe('Validation Enforcers: Min Value', () => {
	it('Does not modify correct integers', () => {
		const res = getValidatorResult('2', 2);
		expect(res).toEqual('2');
	});

	it('Does not modify correct decimals', () => {
		const res = getValidatorResult('2.2', 2.2);
		expect(res).toEqual('2.2');
	});

	it('Incorrect values become correct values', () => {
		const res = getValidatorResult('1', 1.5);
		expect(res).toEqual('1.5');
	});
});
