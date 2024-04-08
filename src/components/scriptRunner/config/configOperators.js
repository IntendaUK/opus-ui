/* eslint-disable max-lines, max-len */

const operators = [
	{
		key: 'all',
		desc: 'Satisfied when all comparisons are true',
		type: 'string',
		keys: [
			{
				key: 'comparisons',
				desc: 'A list of comparisons to be evaluated. Used in conjunction with "all", "some" or "none" operators',
				type: 'array',
				mandatory: true
			}
		]
	},
	{
		key: 'some',
		desc: 'Satisfied when some comparisons are true',
		type: 'string',
		keys: [
			{
				key: 'comparisons',
				desc: 'A list of comparisons to be evaluated. Used in conjunction with "all", "some" or "none" operators',
				type: 'array',
				mandatory: true
			}
		]
	},
	{
		key: 'none',
		desc: 'Satisfied when all comparisons are false',
		type: 'string',
		keys: [
			{
				key: 'comparisons',
				desc: 'A list of comparisons to be evaluated. Used in conjunction with "all", "some" or "none" operators',
				type: 'array',
				mandatory: true
			}
		]
	},
	{
		key: 'case',
		desc: 'Satisfied when "value" matches the cases in branch',
		type: 'string',
		keys: []
	},
	{
		key: 'doFieldsHaveValues',
		desc: 'Satisfied when all components defined in the "fields" have a value',
		type: 'string',
		keys: [
			{
				key: 'fields',
				desc: 'A list of component ids (static or scoped) e.g. ["id1", "id2"] to be used in the "doFieldsHaveValues" comparison operator',
				type: 'array',
				mandatory: true
			}
		]
	},
	{
		key: 'doValuesDifferFromRecord',
		desc: 'Satisfied when any value inside the "values" list differs from that of the "record" value',
		type: 'string',
		keys: [
			{
				key: 'values',
				desc: 'A list of object records e.g. [{a: 1}, {b: 100}] to be used in the "doValuesDifferFromRecord" comparison operator. Used in conjunction with the "record" property',
				type: 'array',
				mandatory: true
			},
			{
				key: 'record',
				desc: 'A record e.g. {key: name, value: "Jon"} to be used in the "doValuesDifferFromRecord" comparison operator. Used in conjunction with the "values" property',
				type: 'object',
				mandatory: true
			}
		]
	},
	{
		key: 'isEqual',
		desc: 'Satisfied when "value" is equal to "compareValue". Note, this will lowercase strings. For case comparison, use operator "isEqualCase"',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The value to be used in the comparison',
				type: ['string', 'integer', 'boolean', 'array', 'object']
			},
			{
				key: 'compareValue',
				desc: 'The compare value to be used in the comparison',
				type: ['string', 'integer', 'boolean', 'array', 'object'],
				mandatory: true
			},
			{
				key: 'key',
				desc: 'The state key inside the source component to use for "value"',
				type: 'string'
			}
		]
	},
	{
		key: 'isEqualCase',
		desc: 'Satisfied when "value" is equal to "compareValue". Note, this is a direct equality comparison',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The value to be used in the comparison',
				type: ['string', 'integer', 'boolean', 'array', 'object']
			},
			{
				key: 'compareValue',
				desc: 'The compare value to be used in the comparison',
				type: ['string', 'integer', 'boolean', 'array', 'object'],
				mandatory: true
			},
			{
				key: 'key',
				desc: 'The state key inside the source component to use for "value"',
				type: 'string'
			}
		]
	},
	{
		key: 'isNotEqual',
		desc: 'Satisfied when "value" is not equal to "compareValue". Note, this will lowercase strings',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The value to be used in the comparison',
				type: ['string', 'integer', 'boolean', 'array', 'object']
			},
			{
				key: 'compareValue',
				desc: 'The compare value to be used in the comparison',
				type: ['string', 'integer', 'boolean', 'array', 'object'],
				mandatory: true
			},
			{
				key: 'key',
				desc: 'The state key inside the source component to use for "value"',
				type: 'string'
			}
		]
	},
	{
		key: 'isFalsy',
		desc: 'Satisfied when "value" is a falsy value. \n See: [MDN: Falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The value to be used in the comparison',
				type: ['string', 'integer', 'boolean']
			},
			{
				key: 'key',
				desc: 'The state key inside the source component to use for "value"',
				type: 'string'
			}
		]
	},
	{
		key: 'isNotFalsy',
		desc: 'Satisfied when the "value" is a truthy value. \n See: [MDN: Truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The value to be used in the comparison',
				type: ['string', 'integer', 'boolean']
			},
			{
				key: 'key',
				desc: 'The state key inside the source component to use for "value"',
				type: 'string'
			}
		]
	},
	{
		key: 'isTruthy',
		desc: 'Satisfied when the "value" is a truthy value. \n See: [MDN: Truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The value to be used in the comparison',
				type: ['string', 'integer', 'boolean', 'array', 'object']
			},
			{
				key: 'key',
				desc: 'The state key inside the source component to use for "value"',
				type: 'string'
			}
		]
	},
	{
		key: 'isNotTruthy',
		desc: 'Satisfied when the "value" is a falsy value. \n See: [MDN: Falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The value to be used in the comparison',
				type: ['string', 'integer', 'boolean']
			},
			{
				key: 'key',
				desc: 'The state key inside the source component to use for "value"',
				type: 'string'
			}
		]
	},
	{
		key: 'isGreaterThan',
		desc: 'Satisfied when "value" is greater than "compareValue"',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The value to be used in the comparison',
				type: ['string', 'integer']
			},
			{
				key: 'compareValue',
				desc: 'The compare value to be used in the comparison',
				type: ['string', 'integer'],
				mandatory: true
			},
			{
				key: 'key',
				desc: 'The state key inside the source component to use for "value"',
				type: 'string'
			}
		]
	},
	{
		key: 'isGreaterEqualThan',
		desc: 'Satisfied when "value" is greater than or equal to "compareValue"',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The value to be used in the comparison',
				type: ['string', 'integer']
			},
			{
				key: 'compareValue',
				desc: 'The compare value to be used in the comparison',
				type: ['string', 'integer'],
				mandatory: true
			},
			{
				key: 'key',
				desc: 'The state key inside the source component to use for "value"',
				type: 'string'
			}
		]
	},
	{
		key: 'isLessThan',
		desc: 'Satisfied when "value" is less than "compareValue"',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The value to be used in the comparison',
				type: ['string', 'integer']
			},
			{
				key: 'compareValue',
				desc: 'The compare value to be used in the comparison',
				type: ['string', 'integer'],
				mandatory: true
			},
			{
				key: 'key',
				desc: 'The state key inside the source component to use for "value"',
				type: 'string'
			}
		]
	},
	{
		key: 'isLessEqualThan',
		desc: 'Satisfied when "value" is less than or equal to "compareValue"',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The value to be used in the comparison',
				type: ['string', 'integer']
			},
			{
				key: 'compareValue',
				desc: 'The compare value to be used in the comparison',
				type: ['string', 'integer'],
				mandatory: true
			},
			{
				key: 'key',
				desc: 'The state key inside the source component to use for "value"',
				type: 'string'
			}
		]
	},
	{
		key: 'isBetween',
		desc: 'Satisfied when "value" is between the min and max ranges defined in "compareValue" e.g. "1-5"',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The value to be used in the comparison',
				type: ['string', 'integer']
			},
			{
				key: 'compareValue',
				desc: 'The range to check in between. e.g. "1-50"',
				type: ['string'],
				mandatory: true
			},
			{
				key: 'key',
				desc: 'The state key inside the source component to use for "value"',
				type: 'string'
			}
		]
	},
	{
		key: 'isBetweenInclusive',
		desc: 'Satisfied when "value" is between or equal to the min and max ranges defined in "compareValue" e.g. "1-5"',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The value to be used in the comparison',
				type: ['string', 'integer']
			},
			{
				key: 'compareValue',
				desc: 'The range to check if value is equal to or between. e.g. "1-50"',
				type: ['string'],
				mandatory: true
			},
			{
				key: 'key',
				desc: 'The state key inside the source component to use for "value"',
				type: 'string'
			}
		]
	},
	{
		key: 'doesContain',
		desc: 'Satisfied when "value" contains "compareValue". Note, this lowercases both "value" and "compareValue"',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The value to be used in the comparison',
				type: ['string']
			},
			{
				key: 'compareValue',
				desc: 'The compare value to be used in the comparison',
				type: ['string'],
				mandatory: true
			},
			{
				key: 'key',
				desc: 'The state key inside the source component to use for "value"',
				type: 'string'
			}
		]
	},
	{
		key: 'doesNotContain',
		desc: 'Satisfied when "value" does not contain "compareValue". Note, this lowercases both "value" and "compareValue"',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The value to be used in the comparison',
				type: ['string']
			},
			{
				key: 'compareValue',
				desc: 'The compare value to be used in the comparison',
				type: ['string'],
				mandatory: true
			},
			{
				key: 'key',
				desc: 'The state key inside the source component to use for "value"',
				type: 'string'
			}
		]
	},
	{
		key: 'containedIn',
		desc: 'Satisfied when "compareValue" contains "value". Note, this lowercases both "value" and "compareValue"',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The value to be used in the comparison',
				type: ['string']
			},
			{
				key: 'compareValue',
				desc: 'The compare value to be used in the comparison',
				type: ['string'],
				mandatory: true
			},
			{
				key: 'key',
				desc: 'The state key inside the source component to use for "value"',
				type: 'string'
			}
		]
	},
	{
		key: 'notContainedIn',
		desc: 'Satisfied when "compareValue" does not contains "value". Note, this lowercases both "value" and "compareValue"',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The value to be used in the comparison',
				type: ['string']
			},
			{
				key: 'compareValue',
				desc: 'The compare value to be used in the comparison',
				type: ['string'],
				mandatory: true
			},
			{
				key: 'key',
				desc: 'The state key inside the source component to use for "value"',
				type: 'string'
			}
		]
	},
	{
		key: 'doesContainCase',
		desc: 'Satisfied when "value" contains "compareValue"',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The value to be used in the comparison',
				type: ['string', 'array']
			},
			{
				key: 'compareValue',
				desc: 'The compare value to be used in the comparison',
				type: ['string', 'integer', 'boolean', 'array', 'object'],
				mandatory: true
			},
			{
				key: 'key',
				desc: 'The state key inside the source component to use for "value"',
				type: 'string'
			}
		]
	},
	{
		key: 'doesNotContainCase',
		desc: 'Satisfied when "value" does not contain "compareValue"',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The value to be used in the comparison',
				type: ['string', 'array']
			},
			{
				key: 'compareValue',
				desc: 'The compare value to be used in the comparison',
				type: ['string', 'integer', 'boolean', 'array', 'object'],
				mandatory: true
			},
			{
				key: 'key',
				desc: 'The state key inside the source component to use for "value"',
				type: 'string'
			}
		]
	},
	{
		key: 'containedInCase',
		desc: 'Satisfied when "compareValue" contains "value"',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The value to be used in the comparison',
				type: ['string', 'integer', 'boolean', 'array', 'object']
			},
			{
				key: 'compareValue',
				desc: 'The compare value to be used in the comparison',
				type: ['string', 'array'],
				mandatory: true
			},
			{
				key: 'key',
				desc: 'The state key inside the source component to use for "value"',
				type: 'string'
			}
		]
	},
	{
		key: 'notContainedInCase',
		desc: 'Satisfied when "compareValue" does not contains "value"',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The value to be used in the comparison',
				type: ['string', 'integer', 'boolean', 'array', 'object']
			},
			{
				key: 'compareValue',
				desc: 'The compare value to be used in the comparison',
				type: ['string', 'array'],
				mandatory: true
			},
			{
				key: 'key',
				desc: 'The state key inside the source component to use for "value"',
				type: 'string'
			}
		]
	},
	{
		key: 'isValidDateString',
		desc: 'Satisfied when "value" is a valid date',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The value to be used in the comparison',
				type: ['string', 'integer']
			},
			{
				key: 'key',
				desc: 'The state key inside the source component to use for "value"',
				type: 'string'
			}
		]
	},
	{
		key: 'isNotValidDateString',
		desc: 'Satisfied when "value" is not a valid date',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The value to be used in the comparison',
				type: ['string', 'integer']
			},
			{
				key: 'key',
				desc: 'The state key inside the source component to use for "value"',
				type: 'string'
			}
		]
	},
	{
		key: 'isValidAgainstRegex',
		desc: 'Satisfied when "value" is valid against the "compareValue" regex',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The value to be used in the comparison',
				type: ['string']
			},
			{
				key: 'compareValue',
				desc: 'The compare value to be used in the comparison',
				type: ['string'],
				mandatory: true
			},
			{
				key: 'key',
				desc: 'The state key inside the source component to use for "value"',
				type: 'string'
			}
		]
	},
	{
		key: 'isNotValidAgainstRegex',
		desc: 'Satisfied when "value" is not valid against the "compareValue" regex',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The value to be used in the comparison',
				type: ['string']
			},
			{
				key: 'compareValue',
				desc: 'The compare value to be used in the comparison',
				type: ['string'],
				mandatory: true
			},
			{
				key: 'key',
				desc: 'The state key inside the source component to use for "value"',
				type: 'string'
			}
		]
	}
];

export default operators;
