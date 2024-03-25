import fnMaxValue from '../../../../../src/validation/constraints/maxValue';

const getValidatorResult = (value, maxValue = 2) => {
	const result = fnMaxValue(value, 'cpt', {
		maxValue,
		errorOverrides: {}
	});

	return result;
};

describe('Validation Constraints: Max Value', () => {
	it('Succeeds if a string is provided', () => {
		const res = getValidatorResult('a');
		expect(res).toEqual(undefined);
	});

	it('Succeeds if a small enough value is provided', () => {
		const res = getValidatorResult(1);
		expect(res).toEqual(undefined);
	});

	it('Succeeds if a small enough value is provided as a string', () => {
		const res = getValidatorResult('1');
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

	it('Fails if a too large value is provided', () => {
		const res = getValidatorResult(3);
		expect(res).toEqual(expect.any(String));
	});

	it('Fails if a too large value is provided as a string', () => {
		const res = getValidatorResult('3');
		expect(res).toEqual(expect.any(String));
	});
});
