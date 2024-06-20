//cssMaps
import { mapToColor } from '@intenda/opus-ui';

//Props
const props = {
	cpt: {
		type: 'string',
		desc: 'The caption of the label'
	},
	color: {
		type: 'string',
		desc: 'Defines the named themed colour that the label text should be rendered in',
		dft: 'text',
		cssAttr: true,
		cssAttrVal: mapToColor
	},
	justify: {
		type: 'string',
		desc: 'Sets the alignment of the text inside the label',
		options: ['left', 'right', 'center', 'stretch'],
		dft: 'start',
		cssAttr: 'textAlign',
		cssAttrVal: v => v === 'stretch' ? 'justify' : v
	}
};

export default props;

