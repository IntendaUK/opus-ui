import { test, expect, describe, it } from 'vitest';

import fnRegex from '../../../../../validation/constraints/regex';

//This expression checks whether all characters are uppercase
const regex = '^[A-Z]*$';

describe('Validation Constraints: Regex', () => {
	it('Succeeds if the value matches the regex', () => {
		const res = fnRegex('TEST', 'cpt', {
			regex,
			errorOverrides: {}
		});
		expect(res).toEqual(undefined);
	});

	it('Fails if the value does not match the regex', () => {
		const res = fnRegex('test', 'cpt', {
			regex,
			errorOverrides: {}
		});
		expect(res).toEqual(expect.any(String));
	});
});
