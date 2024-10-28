//CSS Map Functions
import { mapToColor, mapToSize } from '@intenda/opus-ui';

//Props
const props = {
	value: {
		type: 'string',
		desc: 'A string defining the name of the material icon to be displayed'
	},
	handlerOnClick: {
		type: 'function',
		desc: 'A handler function to be executed upon clicking the icon'
	},
	title: {
		type: 'string',
		desc: 'A title tooltip to be shown when hovering over the icon'
	},
	color: {
		type: 'string',
		desc: 'A string defining the color of the icon',
		dft: 'icon',
		cssAttr: 'color',
		cssAttrVal: mapToColor
	},
	padding: {
		type: 'boolean',
		desc: 'When true, padding will surround the icon',
		cssAttr: 'padding',
		cssAttrVal: (v, state, spec, themes) => {
			if (v)
				return mapToSize('smallPadding', state, spec, themes);
		}
	},
	roundedBorders: {
		type: 'boolean',
		desc: 'When true, the icon will have rounded borders',
		cssAttr: 'border-radius',
		cssAttrVal: (v, state, spec, themes) => {
			if (!v || state.borderRadius)
				return;

			return mapToSize('border-radius', state, spec, themes);
		}
	},
	hasBadge: {
		type: 'boolean',
		desc: 'When true, the icon will display a badge',
		dft: false
	},
	badgeValue: {
		type: 'string',
		desc: 'The value displayed inside the icon\'s badge'
	},
	fontSize: {
		inherited: true,
		dft: 'fontSizeBiggest'
	},
	iconStyle: {
		desc: 'The style of icon to render',
		options: ['filled', 'outlined', 'rounded', 'sharp', 'twoTone'],
		dft: 'filled'
	}
};

export default props;
