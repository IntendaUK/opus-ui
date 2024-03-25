const props = {
	eventsBound: {
		type: 'boolean',
		desc: 'An additional indicator used to unbind events if already bound',
		dft: false,
		internal: true
	},
	domNodeX: {
		type: 'number',
		desc: 'The x coordinate of the node',
		internal: true
	},
	domNodeY: {
		type: 'number',
		desc: 'The y coordinate of the node',
		internal: true
	},
	domNodeHeight: {
		type: 'number',
		desc: 'The height of the node',
		internal: true
	},
	domNodeWidth: {
		type: 'number',
		desc: 'The width of the node',
		internal: true
	},
	eventHandler: {
		type: 'function',
		desc: 'A handler function to be executed on resize',
		internal: true
	},
	blurHandler: {
		type: 'function',
		desc: 'A handler function to be executed on blur',
		internal: true
	}
};

export default props;
