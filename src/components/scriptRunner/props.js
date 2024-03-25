//Props
const props = {
	variables: {
		type: 'object',
		desc: 'An object of variables for the script runner',
		dft: () => ({})
	},
	stopScriptString: {
		type: 'string',
		desc: 'When a script returns this value, subsequent actions will not fire',
		internal: true,
		dft: '!<STOPSCRIPT>!'
	}
};

export default props;
