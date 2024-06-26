//Props
const props = {
	cpt: {
		type: 'string',
		desc: 'This property is simply shorthand for "caption"',
	},
	caption: {
		type: 'string',
		desc: 'The caption of the label',
		dft: ({ cpt }) => cpt
	}
};

export default props;

