const inputsConfig = [
	{
		selector: '#t1',
		desc: 'Passes with [mandatory: true] validator',
		initialValue: 'abc',
		validValue: 'def',
		invalidValue: ''
	},
	{
		selector: '#t2',
		desc: 'Passes with [minLength: 3] validator',
		initialValue: '123',
		validValue: '234',
		invalidValue: ''
	},
	{
		selector: '#t3',
		desc: 'Passes with [maxLength: 3] validator',
		initialValue: '123',
		validValue: '234',
		invalidValue: '1234'
	},
	{
		selector: '#t4',
		desc: 'Passes with [minWords: 3] validator',
		initialValue: 'one two three',
		validValue: 'un deux trois',
		invalidValue: ''
	},
	{
		selector: '#t5',
		desc: 'Passes with [maxWords: 3] validator',
		initialValue: 'abc',
		validValue: 'un deux trois',
		invalidValue: 'one two three four'
	},
	{
		selector: '#t6',
		desc: 'Passes with [minValue: 3] validator',
		initialValue: '3',
		validValue: '4',
		invalidValue: '2'
	},
	{
		selector: '#t7',
		desc: 'Passes with [maxValue: 3] validator',
		initialValue: '3',
		validValue: '2',
		invalidValue: '4'
	},
	{
		selector: '#t8',
		desc: 'Passes with [notRegex: ([a-z])+] validator',
		initialValue: 'ABC',
		validValue: 'DEF',
		invalidValue: 'abc'
	},
	{
		selector: '#t9',
		desc: 'Passes with [regex: ([a-z])+] validator',
		initialValue: 'abc',
		validValue: 'def',
		invalidValue: 'ABC'
	},
	{
		selector: '#t10',
		desc: 'Passes with [decimalScale: 2] validator',
		initialValue: '1.23',
		validValue: '2.34',
		invalidValue: '1.2'
	},
	{
		selector: '#t11',
		desc: 'Passes with [precision: 5] validator',
		initialValue: '123.45',
		validValue: '234.56',
		invalidValue: '123.4'
	}
];

export default inputsConfig;
