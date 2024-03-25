const props = {
	display: {
		type: 'boolean',
		desc: 'When true the localStorageManager will be shown',
		internal: true
	},
	lookupKeys: {
		type: 'object',
		desc: 'A lookup object containing a list of local storage keys',
		internal: true
	},
	value: {
		type: 'object',
		desc: 'The selected value to be shown inside the code component',
		internal: true
	},
	enabled: {
		type: 'boolean',
		desc: 'When true the remove local storage item button will be enabled',
		internal: true
	}
};

export default props;
