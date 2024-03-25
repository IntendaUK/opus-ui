import fnMinLength from '../../../../../src/validation/constraints/minLength';

const getValidatorResult = (value, minLength = 2) => {
	const result = fnMinLength(value, 'cpt', {
		minLength,
		errorOverrides: {}
	});

	return result;
};

describe('Validation Constraints: Max Length', () => {
	it('Succeeds if a long enough string is provided', () => {
		const res = getValidatorResult('ab');
		expect(res).toEqual(undefined);
	});

	it('Succeeds if a long enough number is provided', () => {
		const res = getValidatorResult(12);
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

	it('Fails if too short of a string is provided', () => {
		const res = getValidatorResult('a');
		expect(res).toEqual(expect.any(String));
	});

	it('Fails if too short of a number is provided', () => {
		const res = getValidatorResult(1);
		expect(res).toEqual(expect.any(String));
	});
});
