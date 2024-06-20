const enforcedInputsConfig = [
	{
		selector: '#t1',
		desc: 'Passes with [minLength: 3] validator',
		initialCorrectValue: '___',
		initialIncorrectValue: '_',
		validValue: '123',
		enforcedValue: '___'
	},
	{
		selector: '#t2',
		desc: 'Passes with [maxLength: 3] validator',
		initialCorrectValue: '___',
		initialIncorrectValue: '____',
		validValue: '123',
		enforcedValue: '___'
	},
	{
		selector: '#t3',
		desc: 'Passes with [maxWords: 3] validator',
		initialCorrectValue: 'one two three',
		initialIncorrectValue: 'one two three four',
		validValue: 'un deux trois',
		enforcedValue: 'one two three'
	},
	{
		selector: '#t4',
		desc: 'Passes with [minValue: 3] validator',
		initialCorrectValue: '3',
		initialIncorrectValue: '2',
		validValue: '4',
		enforcedValue: '3'
	},
	{
		selector: '#t5',
		desc: 'Passes with [maxValue: 3] validator',
		initialCorrectValue: '3',
		initialIncorrectValue: '4',
		validValue: '2',
		enforcedValue: '3'
	},
	{
		selector: '#t6',
		desc: 'Passes with [decimalScale: 2] validator',
		initialCorrectValue: '1.23',
		initialIncorrectValue: '1.2',
		validValue: '2.34',
		enforcedValue: '1.20'
	},
	{
		selector: '#t7',
		desc: 'Passes with [precision: 5] validator',
		initialCorrectValue: '123.45',
		initialIncorrectValue: '1234.56',
		validValue: '234.56',
		enforcedValue: '1234.5'
	}
];

export default enforcedInputsConfig;
