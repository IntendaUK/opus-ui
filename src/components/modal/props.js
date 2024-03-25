/* eslint-disable max-len */
const props = {
	hidden: {
		type: 'boolean',
		desc: 'When true, the hidden class will be applied to hide the modal',
		classMap: true
	},
	display: {
		type: 'boolean',
		desc: 'When true, the modal will be hidden'
	},
	inputMda: {
		type: 'object',
		desc: 'Contains the metadata that should be rendered in the viewport. Should not be used in conjunction with value.'
	},
	lookup: {
		type: 'object',
		desc: 'Data that should be entered into the modal if open has a value'
	},
	lookupDtaObj: {
		type: 'string',
		desc: 'The path pointing to the lookup data'
	},
	lookupData: {
		type: 'array',
		desc: 'Data for the lookup'
	},
	lookupFilters: {
		type: 'array',
		desc: 'A list filters that should be applied to the lookup'
	},
	lookupPrps: {
		type: 'object',
		desc: 'A object of extra lookup prps'
	},
	lookupWgts: {
		type: 'array',
		desc: 'Wgts for the lookup'
	},
	fromId: {
		type: 'string',
		desc: 'The ID of the component that caused the modal to load'
	},
	complex: {
		type: 'boolean',
		desc: 'When true, the modal will automatically render a toolbar with a close button and an inner container to house the lookup grid',
		dft: false,
		classMap: true
	}
};

export default props;
