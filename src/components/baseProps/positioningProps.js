/* eslint-disable max-lines, max-len */
//CSS Map Functions
import mapToSize from '../../props/cssMaps/mapToSize';

//Props
const props = {
	position: {
		type: 'string',
		desc: 'Changes how the component is positioned relative to its parent',
		options: ['relative', 'absolute', 'fixed', 'static'],
		cssAttr: true,
		cssAttrVal: mapToSize
	},
	left: {
		type: 'number',
		desc: 'The number of units (usually in pixels) in which specifies the horizontal position of the component, starting from the left',
		cssAttr: true,
		cssAttrVal: mapToSize
	},
	right: {
		type: 'number',
		desc: 'The number of units (usually in pixels) in which specifies the horizontal position of the component, starting from the right',
		cssAttr: true,
		cssAttrVal: mapToSize
	},
	top: {
		type: 'number',
		desc: 'The number of units (usually in pixels) in which specifies the vertical position of the component, starting from the top',
		cssAttr: true,
		cssAttrVal: mapToSize
	},
	bottom: {
		type: 'number',
		desc: 'The number of units (usually in pixels) in which specifies the vertical position of the component, starting from the bottom',
		cssAttr: true,
		cssAttrVal: mapToSize
	},
	margin: {
		type: 'string',
		desc: 'Specifies the margin for the component',
		cssAttr: true,
		cssAttrVal: mapToSize
	},
	marginTop: {
		type: 'string',
		desc: 'Specifies the top margin for the component',
		cssAttr: true,
		cssAttrVal: mapToSize
	},
	marginRight: {
		type: 'string',
		desc: 'Specifies the right margin for the component',
		cssAttr: true,
		cssAttrVal: mapToSize
	},
	marginLeft: {
		type: 'string',
		desc: 'Specifies the left margin for the component',
		cssAttr: true,
		cssAttrVal: mapToSize
	},
	marginBottom: {
		type: 'string',
		desc: 'Specifies the bottom margin for the component',
		cssAttr: true,
		cssAttrVal: mapToSize
	},
	alignSelf: {
		type: 'string',
		desc: 'Defines the positioning of a component relative to its container',
		cssAttr: true,
		cssAttrVal: true
	},
	alignItems: {
		type: 'string',
		desc: 'Specifies the default alignment for items inside the component',
		options: ['normal', 'stretch', 'center', 'flex-start', 'flex-end', 'start', 'end', 'baseline', 'initial', 'inherit'],
		cssAttr: true,
		cssAttrVal: true
	},
	rotate: {
		type: 'number',
		desc: 'A number defining the amount in degrees that the component will be rotated'
	},
	flexSize: {
		type: 'string',
		desc: 'Shorthand Property for defining the flex. See Examples here: https://www.freecodecamp.org/news/flexbox-the-ultimate-css-flex-cheatsheet/',
		cssAttr: 'flex',
		cssAttrVal: true
	},
	flexGrow: {
		type: 'number',
		desc: 'Defines how much a component will grow relative to other components in container',
		cssAttr: true,
		cssAttrVal: true
	},
	flexShrink: {
		type: 'number',
		desc: 'Defines how much a component will shrink relative to other components in container',
		cssAttr: true,
		cssAttrVal: true
	},
	flexBasis: {
		type: 'number',
		desc: 'Specifies the initial length of a flexible component',
		spec: '100px',
		cssAttr: true,
		cssAttrVal: mapToSize
	},
	flexWrap: {
		type: 'string',
		desc: 'Defines the style value for the flex-wrap style',
		options: [
			'nowrap',
			'wrap',
			'wrap-reverse',
			'inherit'
		],
		cssAttr: true,
		cssAttrVal: true,
		dft: 'unset'
	},
	flexDirection: {
		type: 'string',
		desc: 'Defines the style value for the flex-wrap style',
		options: [
			'row',
			'row-reverse',
			'column',
			'column-reverse',
			'inherit'
		],
		cssAttr: true,
		cssAttrVal: true
	},
	paddingSize: {
		type: 'string',
		desc: 'Padding to be applied to the element',
		cssAttr: 'padding',
		cssAttrVal: mapToSize
	},
	paddingTop: {
		type: 'string',
		desc: 'Specifies the top padding for the component',
		cssAttr: true,
		cssAttrVal: mapToSize
	},
	paddingRight: {
		type: 'string',
		desc: 'Specifies the right padding for the component',
		cssAttr: true,
		cssAttrVal: mapToSize
	},
	paddingLeft: {
		type: 'string',
		desc: 'Specifies the left padding for the component',
		cssAttr: true,
		cssAttrVal: mapToSize
	},
	paddingBottom: {
		type: 'string',
		desc: 'Specifies the bottom padding for the component',
		cssAttr: true,
		cssAttrVal: mapToSize
	},
	translate: {
		type: 'string',
		desc: 'Allows you to change the posistion of an element.',
		cssAttr: true,
		cssAttrVal: mapToSize
	}
};

export default props;
