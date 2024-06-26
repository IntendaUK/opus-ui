/* eslint-disable max-lines, max-len */

//CSS Map Functions
import mapToColor from '../../props/cssMaps/mapToColor';
import mapToSize from '../../props/cssMaps/mapToSize';

const props = {
	collapsed: {
		type: 'boolean',
		desc: 'When true, the container is collapsed',
		dft: ({ collapsible }) => {
			if (collapsible === true)
				return false;
		},
		classMap: true
	},
	roundedBorders: {
		type: 'boolean',
		desc: 'When true, the container will have rounded borders',
		dft: false,
		cssAttr: 'borderRadius',
		cssAttrVal: (v, state, spec, themes) => {
			if (!v || state.borderRadius)
				return;

			return mapToSize('borderRadius', state, spec, themes);
		}
	},
	dir: {
		type: 'string',
		desc: 'A string defining the flex direction container\'s children',
		options: ['vertical', 'horizontal'],
		classMap: val => val,
		dft: ({ toolbar }) => {
			if (toolbar)
				return 'horizontal';

			return 'vertical';
		}
	},
	singlePage: {
		type: 'boolean',
		desc: 'When set to true, containers will fill the maximum height available to them. If its children overlap the area, the container will scroll as opposed to the container growing to facilitate children',
		classMap: true
	},
	flex: {
		type: 'boolean',
		desc: 'When true, the container will grow to use up all available space',
		classMap: true,
		dft: false
	},
	flexWrap: {
		type: 'string',
		desc: 'Defines the style value for the flex-wrap style',
		options: ['nowrap',
			'wrap',
			'wrap-reverse',
			'initial',
			'inherit'],
		cssAttr: 'flexWrap',
		cssAttrVal: true,
		dft: 'unset'
	},
	canShrink: {
		type: 'boolean',
		desc: 'When true, the container will be allowed to shrink (past its minimum size) to make place for other flex containers',
		classMap: true,
		dft: false
	},
	padding: {
		type: 'boolean',
		desc: 'When true, the container\'s content area will have any padding surrounding it'
	},
	backgroundImage: {
		type: 'string',
		desc: 'A url pointing to the container\'s background image',
		cssAttr: true,
		cssAttrVal: true
	},
	backgroundSize: {
		type: 'string',
		desc: 'A string percentage defining how big (in relation to the container) the background should be',
		cssAttr: true,
		cssAttrVal: true
	},
	backgroundImageRepeat: {
		type: 'string',
		desc: 'A string used to define how the background image should repeat',
		options: ['repeat', 'horizontal', 'vertical', 'stretch', 'space'],
		dft: 'unset',
		cssAttr: 'backgroundRepeat',
		cssAttrVal: v => ({
			none: 'no-repeat',
			repeat: 'repeat',
			horizontal: 'repeat-x',
			vertical: 'repeat-y',
			stretch: 'round',
			space: 'space'
		}[v])
	},
	backgroundImagePosition: {
		type: 'string',
		desc: 'A string used to define how the position of the background image',
		options: ['bottom', 'center', 'left', 'right', 'top'],
		dft: 'unset',
		cssAttr: 'backgroundPosition',
		cssAttrVal: true
	},
	styles: {
		type: 'object',
		desc: 'An object defining custom styles to be applied to the container'
	},
	hasShadow: {
		type: 'boolean',
		desc: 'When set to true, the container\'s shadow style will be applied',
		dft: false
	},
	shadow: {
		type: 'string',
		desc: 'A string defining the component\'s shadow',
		cssAttr: 'boxShadow',
		cssAttrVal: true,
		dft: ({ hasShadow }) => {
			if (!hasShadow)
				return null;

			return '0 1px 4px 0 rgba(0, 0, 0, 0.14)';
		}
	},
	autoChildMargins: {
		type: 'boolean',
		desc: 'When true, child elements will receive left margins if the container is horizontal and top margins if the container is vertical',
		dft: false,
		classMap: true
	},
	autoChildMarginsSize: {
		type: 'string',
		desc: 'The size of the margin between child elements when autoChildMargins is set to true',
		dft: 'padding',
		cssVar: 'auto-child-margins-size',
		cssVarVal: mapToSize
	},
	mainAxisAlign: {
		type: 'string',
		desc: 'When the direction is set to horizontal, this affects how children are aligned horizontally, when the direction is set to vertical, this affects vertical alignment',
		options: ['start', 'end', 'center', 'space-between', 'space-around'],
		dft: 'unset',
		cssAttr: 'justifyContent',
		cssAttrVal: v => {
			let mappedValue = v;
			if (['start', 'end'].includes(v))
				mappedValue = `flex-${v}`;

			return mappedValue;
		}
	},
	crossAxisAlign: {
		type: 'string',
		desc: 'When the direction is set to horizontal, this affects how children are aligned vertically, when the direction is set to vertical, this affects horizontal alignment',
		options: ['start', 'end', 'center', 'space-between', 'space-around'],
		dft: 'stretch',
		cssAttr: 'alignItems',
		cssAttrVal: v => {
			let mappedValue = v;
			if (['start', 'end'].includes(v))
				mappedValue = `flex-${v}`;

			return mappedValue;
		}
	},
	faded: {
		type: 'boolean',
		desc: 'When true, a dark mask is rendered over the container',
		classMap: true
	},
	position: {
		type: 'string',
		desc: 'A property how the container is positioned relative to its parent',
		options: ['relative', 'absolute', 'fixed', 'static'],
		dft: 'relative',
		cssAttr: true,
		cssAttrVal: true
	},
	backgroundColor: {
		type: 'string',
		desc: 'The background color of the container',
		dft: 'transparent',
		cssAttr: true,
		cssAttrVal: mapToColor
	},
	renderChildren: {
		type: 'boolean',
		desc: 'When this is false, child components won\'t be rendered',
		dft: true
	},
	renderChildrenWhenInvis: {
		type: 'boolean',
		desc: 'When this is false and the container is invisible (vis: false), child components won\'t be rendered. This property is overriden by renderChildren',
		dft: false
	},
	paddingSize: {
		type: 'string',
		desc: 'Padding to be applied to the element',
		dft: 'padding',
		cssAttr: 'padding',
		cssAttrVal: (v, state, spec, themes) => {
			if (state.padding)
				return mapToSize(v, state, spec, themes);
		}
	},
	cloneChildrenBeforeMount: {
		type: 'boolean',
		desc: 'When set to true, Wrapper will be sent cloned metadata. Set this to true when children will have extraWgts (or other non-primitive props) that should not persist between mounts',
		dft: false
	}
};

export default props;
