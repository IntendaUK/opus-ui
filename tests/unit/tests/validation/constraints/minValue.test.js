import fnMinValue from '../../../../../src/validation/constraints/minValue';

const getValidatorResult = (value, minValue = 2) => {
	const result = fnMinValue(value, 'cpt', {
		minValue,
		errorOverrides: {}
	});

	return result;
};

describe('Validation Constraints: Min Value', () => {
	it('Succeeds if a string is provided', () => {
		const res = getValidatorResult('a');
		expect(res).toEqual(undefined);
	});

	it('Succeeds if a large enough value is provided', () => {
		const res = getValidatorResult(2);
		expect(res).toEqual(undefined);
	});

	it('Succeeds if a large enough value is provided as a string', () => {
		const res = getValidatorResult('2');
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

	it('Fails if a too small value is provided', () => {
		const res = getValidatorResult(1);
		expect(res).toEqual(expect.any(String));
	});

	it('Fails if a too small value is provided as a string', () => {
		const res = getValidatorResult('1');
		expect(res).toEqual(expect.any(String));
	});
});
