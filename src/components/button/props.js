/* eslint-disable max-lines */

//CSS Map Functions
import { mapToColor, mapToSize } from '../../library';

//Props
const props = {
	round: {
		type: 'boolean',
		desc: 'When true, buttons will be round',
		dft: false,
		classMap: true
	},
	color: {
		type: 'string',
		desc: 'The name of the theme colour to use as the button background',
		dft: 'transparent',
		cssAttr: 'backgroundColor',
		cssAttrVal: mapToColor
	},
	clicked: {
		type: 'boolean',
		desc: 'When true, the button was clicked',
		internal: true
	},
	fireScript: {
		type: 'object',
		desc: 'A script to be passed to scriptRunner on click'
	},
	handlerOnClick: {
		type: 'function',
		desc: 'A handler function to be executed on click'
	},
	open: {
		type: 'string',
		desc: 'A string specifying which popup to show on click'
	},
	close: {
		type: 'string',
		desc: 'A string specifying which popup to close on click'
	},
	lookup: {
		type: 'object',
		desc: 'Data that should be entered into the modal if open has a value'
	},
	hasBorder: {
		type: 'boolean',
		desc: 'When true, the button will have a border',
		classMap: true,
		dft: false
	},
	shadow: {
		type: 'boolean',
		desc: 'When true, the the button will have a shadow',
		classMap: true,
		dft: false
	},
	dir: {
		type: 'string',
		options: ['horizontal', 'horizontal-reverse', 'vertical', 'vertical-reverse'],
		dft: 'horizontal',
		desc: 'The flex direction of the button\'s inner icon, caption and badge',
		classMap: v => v
	},
	hasBadge: {
		type: 'boolean',
		desc: 'When true, the button will display a badge',
		dft: false,
		classMap: true
	},
	badgeValue: {
		type: 'string',
		desc: 'The value displayed inside the button\'s badge'
	},
	roundedBorders: {
		type: 'boolean',
		desc: 'When true, the button will have rounded borders',
		dft: false,
		cssAttr: 'borderRadius',
		cssAttrVal: (v, state, spec, themes) => {
			if (!v || state.borderRadius)
				return;

			return mapToSize('border-radius', state, spec, themes);
		}
	},
	prpsLabel: {
		type: 'object',
		desc: 'Override properties for the label that\'s rendered for the button\'s caption'
	},
	prpsIcon: {
		type: 'object',
		desc: 'Override properties for the icon that\'s rendered for the button\'s icon'
	},

	//Overrides for baseProps
	paddingSize: {
		type: 'string',
		desc: 'Padding to be applied to the element',
		dft: 'smallPadding',
		cssAttr: 'padding',
		cssAttrVal: (v, state, spec, themes) => {
			if (state.padding)
				return mapToSize(v, state, spec, themes);
		}
	}
};

export default props;
