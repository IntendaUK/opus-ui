import fnMandatory from '../../../../../src/validation/constraints/mandatory';

const getValidatorResult = value => {
	const result = fnMandatory(value, 'cpt', {
		mandatory: true,
		errorOverrides: {}
	});

	return result;
};

describe('Validation Constraints: Mandatory', () => {
	it('Succeeds if a string is provided', () => {
		const res = getValidatorResult('test');
		expect(res).toEqual(undefined);
	});

	it('Succeeds if a number is provided', () => {
		const res = getValidatorResult(0);
		expect(res).toEqual(undefined);
	});

	it('Succeeds if a boolean value is provided', () => {
		const res = getValidatorResult(false);
		expect(res).toEqual(undefined);
	});

	it('Fails if an empty string is provided', () => {
		const res = getValidatorResult('');
		expect(res).toEqual(expect.any(String));
	});

	it('Fails if null is provided', () => {
		const res = getValidatorResult(null);
		expect(res).toEqual(expect.any(String));
	});

	it('Fails if undefined is provided', () => {
		const res = getValidatorResult(undefined);
		expect(res).toEqual(expect.any(String));
	});
});
