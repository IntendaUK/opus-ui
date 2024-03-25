import fnNotRegex from '../../../../../src/validation/constraints/notRegex';

//This expression checks whether all characters are uppercase
const notRegex = '^[A-Z]*$';

describe('Validation Constraints: Not Regex', () => {
	it('Fails if the value matches the regex', () => {
		const res = fnNotRegex('TEST', 'cpt', {
			notRegex,
			errorOverrides: {}
		});
		expect(res).toEqual(expect.any(String));
	});

	it('Succeeds if the value does not match the regex', () => {
		const res = fnNotRegex('test', 'cpt', {
			notRegex,
			errorOverrides: {}
		});
		expect(res).toEqual(undefined);
	});
});
