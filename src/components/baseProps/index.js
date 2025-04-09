/* eslint-disable max-len, max-lines*/

/* IMPORTANT
	Shorthand properties that can be overridden (like margin and marginTop)
	should be structured in the following manner:
		...
		shorthand
		overrides
		...
	That is, margin and border (for example) should be above marginTop and borderTop
*/

//CSS Map Functions
import mapToColor from '../../props/cssMaps/mapToColor';
import mapToSize from '../../props/cssMaps/mapToSize';

//Props for defining the positioning of the component
import positioningProps from './positioningProps';
//Props for defining an attribute that exists over another attribute
import overlayProps from './overlayProps';
//Props for defining animations and transformations
import animationProps from './animationProps';

const props = {
	//Below are system component properties that perform various functions
	enabled: {
		type: 'boolean',
		desc: 'If true, the component will be enabled',
		dft: true,
		classMap: '!disabled'
	},
	vis: {
		type: 'boolean',
		desc: 'If true, the component will be visible',
		dft: true,
		classMap: '!hidden'
	},
	flows: {
		type: 'array',
		desc: 'A list of flows for the component',
		dft: () => []
	},
	scps: {
		type: 'array',
		desc: 'A list of scps for the component',
		dft: () => []
	},
	diagnostics: {
		type: 'object',
		desc: 'An object defining diagnostics for a component'
	},
	tags: {
		type: 'array',
		desc: 'A list of tags that a component is marked as. Tags can be used to create dynamic flows',
		dft: () => [],

		setAction: (oldValue = [], newValue) => {
			if (!Array.isArray(newValue))
				newValue = [ newValue];

			newValue.forEach(t => {
				if (oldValue.includes(t))
					return;

				oldValue.push(t);
			});

			return oldValue;
		},

		deleteAction: (oldValue = [], newValue) => {
			if (!Array.isArray(newValue))
				newValue = [ newValue];

			newValue.forEach(t => {
				oldValue.spliceWhere(tag => tag === t);
			});

			return oldValue;
		}
	},
	morphProps: {
		type: 'array',
		desc: 'Defines a list of props that can have their value replaced before mount. These props should have values of the form: ((state.id.key))'
	},
	genClassNames: {
		type: 'string',
		internal: true,
		desc: 'Class names that are generated for class-mapped properties and automatically attached to components'
	},
	genStyles: {
		type: 'object',
		internal: true,
		desc: 'Styles that are generated for CSS attribute-, and variable properties and automatically attached to components'
	},
	genAttributes: {
		type: 'object',
		internal: true,
		desc: 'HTML Attributes that are generated for properties (as defined in "attr" properties) and automatically attached to components'
	},
	cssVars: {
		type: 'array',
		desc: 'A list of css variables that should be attached to the element',
		spec: {
			name: 'The name of the css variable',
			value: 'The value of the css variable (optional)',
			propertyValue: 'The property which should be used to define the value of the css variable (optional)'
		}
	},
	persist: {
		type: 'array',
		desc: 'A list of properties that should be persisted when the component remounts. This only works for static id components',
		spec: ['propery 1', 'property 2']
	},
	canHover: {
		type: 'boolean',
		desc: 'Defines whether the component can be hovered upon. If this is true, hoverPrps.on/.off will be applied when applicable'
	},
	//Below are properties that can be used to style the component in various ways
	className: {
		type: 'string',
		desc: 'A list of classes to be given to the container',
		classMap: v => v
	},
	width: {
		type: 'number',
		desc: 'The width of the component',
		cssAttr: true,
		cssAttrVal: mapToSize
	},
	height: {
		type: 'number',
		desc: 'The height of the component',
		cssAttr: true,
		cssAttrVal: mapToSize
	},
	maxWidth: {
		type: 'number',
		desc: 'The max width of the component',
		cssAttr: true,
		cssAttrVal: mapToSize
	},
	maxHeight: {
		type: 'number',
		desc: 'The max height of the component',
		cssAttr: true,
		cssAttrVal: mapToSize
	},
	minWidth: {
		type: 'number',
		desc: 'The min width of the component',
		cssAttr: true,
		cssAttrVal: mapToSize
	},
	minHeight: {
		type: 'number',
		desc: 'The min height of the component',
		cssAttr: true,
		cssAttrVal: mapToSize
	},
	lineHeight: {
		type: 'number',
		desc: 'The line height of the component',
		cssAttr: true,
		cssAttrVal: true
	},
	scale: {
		type: 'string',
		desc: 'Define how large an element should be. See examples Here: https://www.w3schools.com/cssref/css_pr_scale.php',
		cssAttr: true,
		cssAttrVal: true
	},
	border: {
		type: 'string',
		desc: '',
		cssAttr: true,
		cssAttrVal: true
	},
	borderTop: {
		type: 'string',
		desc: 'A string that defines the component\'s top border',
		cssAttr: true,
		cssAttrVal: true
	},
	borderRight: {
		type: 'string',
		desc: 'A string that defines the component\'s right border',
		cssAttr: true,
		cssAttrVal: true
	},
	borderBottom: {
		type: 'string',
		desc: 'A string that defines the component\'s bottom border',
		cssAttr: true,
		cssAttrVal: true
	},
	borderLeft: {
		type: 'string',
		desc: 'A string that defines the component\'s left border',
		cssAttr: true,
		cssAttrVal: true
	},
	imageRendering: {
		type: 'string',
		desc: 'Used to define the rendering method for scaling an image',
		options: ['auto', 'smooth', 'high-quality', 'pixelated', 'crisp-edges'],
		cssAttr: true,
		cssAttrVal: true
	},
	background: {
		type: 'string',
		desc: 'The background color of the component',
		cssAttr: true,
		cssAttrVal: mapToColor
	},
	backgroundColor: {
		type: 'string',
		desc: 'The background color of the component',
		cssAttr: true,
		cssAttrVal: mapToColor
	},
	backgroundImage: {
		type: 'string',
		desc: 'The url of the background image of the component',
		spec: 'url("path/file.extension")',
		cssAttr: true,
		cssAttrVal: true
	},
	backgroundPosition: {
		type: 'string',
		desc: 'The postion of the background inside of the component',
		options: [
			'left-top',
			'left-center',
			'left-bottom',
			'right-top',
			'right-center',
			'right-bottom',
			'center-top',
			'center-center',
			'center-bottom'
		],
		cssAttr: true,
		cssAttrVal: true
	},
	backgroundRepeat: {
		type: 'string',
		desc: 'Sets if/how the background image should be repeated',
		options: [
			'repeat',
			'repeat-x',
			'repeat-y',
			'no-repeat',
			'space',
			'round'
		],
		cssAttr: true,
		cssAttrVal: true
	},
	backgroundSize: {
		type: 'string',
		desc: 'Sets the size of the background in px or relative to its parent container. See more at https://www.w3schools.com/cssref/css3_pr_background-size.php',
		cssAttr: true,
		cssAttrVal: mapToSize
	},
	color: {
		type: 'string',
		desc: 'The color of the component',
		cssAttr: true,
		cssAttrVal: mapToColor
	},
	overflow: {
		type: 'string',
		desc: 'Specifies the overflow style for the component',
		cssAttr: true,
		cssAttrVal: true
	},
	overflowX: {
		type: 'string',
		desc: 'Specifies the horizontal overflow style for the component',
		cssAttr: true,
		cssAttrVal: true
	},
	overflowY: {
		type: 'string',
		desc: 'Specifies the vertical overflow style for the component',
		cssAttr: true,
		cssAttrVal: true
	},
	overflowWrap: {
		type: 'string',
		desc: 'Specifies if line breaks must be inserted to break up longer words in a line element',
		options: ['normal', 'break-word', 'anywhere'],
		cssAttr: true,
		cssAttrVal: true
	},
	textOverflow: {
		type: 'string',
		desc: 'Specifies the text overflow style for the component',
		cssAttr: true,
		cssAttrVal: true
	},
	whiteSpace: {
		type: 'string',
		desc: 'Specifies the whitespace style for the component',
		cssAttr: true,
		cssAttrVal: true
	},
	pointerEvents: {
		type: 'string',
		desc: 'Specifies the pointer event style for the component',
		cssAttr: true,
		cssAttrVal: true
	},
	userSelect: {
		type: 'string',
		desc: 'Specifies the userSelect of the component',
		cssAttr: true,
		cssAttrVal: true
	},
	zIndex: {
		type: 'number',
		desc: 'Specifies the z-index style for the component',
		cssAttr: true,
		cssAttrVal: true
	},
	opacity: {
		type: 'number',
		desc: 'Specifies the opacity style for the component',
		cssAttr: true,
		cssAttrVal: true
	},
	shadow: {
		type: 'string',
		desc: 'A string defining the component\'s shadow',
		cssAttr: 'boxShadow',
		cssAttrVal: true
	},
	font: {
		type: 'string',
		desc: 'A shorthand string used to define that font. see more here: https://www.w3schools.com/css/css_font_shorthand.asp',
		cssAttr: true,
		cssAttrVal: true
	},
	fontFamily: {
		type: 'string',
		desc: 'A string defining the font family of the component',
		cssAttr: true,
		cssAttrVal: true
	},
	fontSize: {
		type: 'string',
		desc: 'A string defining the font size of the component',
		cssAttr: true,
		cssAttrVal: mapToSize
	},
	fontWeight: {
		type: 'number',
		desc: 'Defines the thickness of text. Only supports values allowed by the loaded font',
		cssAttr: true,
		cssAttrVal: true
	},
	textShadow: {
		type: 'string',
		desc: 'A string used to define the shadow applied to the text',
		spec: '2px 2px #ff0000',
		cssAttr: true,
		cssAttrVal: mapToColor
	},
	borderRadius: {
		type: 'string',
		desc: 'A string consisting of one or more words to set each corner of the component',
		cssAttr: 'borderRadius',
		cssAttrVal: mapToSize
	},
	cursor: {
		type: 'string',
		desc: 'A string representing the cursor to be displayed over an element. See examples here: https://www.w3schools.com/cssref/pr_class_cursor.asp',
		options: ['alias', 'all-scroll', 'auto', 'cell', 'context-menu', 'col-resize', 'copy', 'crosshair', 'default', 'e-resize', 'ew-resize', 'grab', 'grabbing', 'help', 'move', 'n-resize', 'ne-resize', 'nesw-resize', 'ns-resize', 'nw-resize', 'nwse-resize', 'no-drop', 'none', 'not-allowed', 'pointer', 'progress', 'row-resize', 's-resize', 'se-resize', 'sw-resize', 'text', 'URL', 'vertical-text', 'w-resize', 'wait', 'zoom-in', 'zoom-out'],
		cssAttr: true,
		cssAttrVal: true
	},
	display: {
		type: 'string',
		desc: 'Specifies the display behavior (the type of rendering box) of an element. Common values include block, inline, flex, grid, and none. This property determines how an element is visually laid out on the page. See examples here: https://www.w3schools.com/cssref/pr_class_display.asp',
		options: [
			'block',
			'flex',
			'grid',
			'inherit',
			'initial',
			'inline',
			'inline-block',
			'inline-flex',
			'inline-grid',
			'inline-table',
			'list-item',
			'none',
			'table',
			'table-caption',
			'table-cell',
			'table-column',
			'table-column-group',
			'table-footer-group',
			'table-header-group',
			'table-row',
			'table-row-group'
		],
		cssAttr: true,
		cssAttrVal: true
	},
	order: {
		type: 'number',
		desc: 'A number representing the order to layout an item in flex or grid container. See examples here: https://www.w3schools.com/cssref/css3_pr_order.asp',
		cssAttr: true,
		cssAttrVal: true
	},
	backfaceVisibility: {
		type: 'string',
		options: ['visible', 'hidden'],
		desc: 'Defines whether the backface of a component should be visible or not. See examples here: https://www.w3schools.com/cssref/css3_pr_backface-visibility.asp',
		cssAttr: true,
		cssAttrVal: true
	},
	gap: {
		type: 'string',
		desc: 'A string defining the size of the gaps between column or containers. See examples here: https://www.w3schools.com/cssref/css3_pr_gap.php',
		cssAttr: true,
		cssAttrVal: mapToSize
	},
	textAlign: {
		type: 'string',
		options: ['center', 'left', 'right', 'justify'],
		desc: 'A string that specifies the horizontal alignment of text in an element. See examples here: https://www.w3schools.com/cssref/pr_text_text-align.ASP',
		cssAttr: true,
		cssAttrVal: true
	},
	filter: {
		type: 'string',
		options: ['none', 'blur', 'brightness', 'contrast', 'drop-shadow', 'grayscale', 'hue-rotate', 'invert', 'opacity', 'saturate', 'sepia', 'url'],
		desc: 'A string that specifies what filter should be applied to a component. See examples here: https://www.w3schools.com/cssref/css3_pr_filter.php',
		cssAttr: true,
		cssAttrVal: true
	},
	backdropFilter: {
		type: 'string',
		options: ['none', 'blur', 'brightness', 'contrast', 'drop-shadow', 'grayscale', 'hue-rotate', 'invert', 'opacity', 'saturate', 'sepia', 'url'],
		desc: 'A string that specifies what filter should be applied to a backdrop. See examples here: https://www.w3schools.com/cssref/css3_pr_backdrop-filter.php',
		cssAttr: true,
		cssAttrVal: true
	},
	clipPath: {
		type: 'string',
		desc: 'The clipPath property creates a clipping region that sets what part of an element should be shown. Parts that are inside the region are shown, while those outside are hidden. See examples here: The clip-path property lets you clip an element to a basic shape or to an SVG source',
		cssAttr: true,
		cssAttrVal: true
	},
	grid: {
		type: 'string',
		desc: 'The Shorthand string to define a grid inside of a component',
		cssAttr: true,
		cssAttrVal: true
	},
	gridArea: {
		type: 'string',
		desc: 'The Grid Area property is a shorthand property that specifies a grid Items size and location within the layout. See use here: https://www.w3schools.com/cssref/pr_grid-area.php',
		cssAttr: true,
		cssAttrVal: true
	},
	gridColumn: {
		type: 'string',
		desc: 'The Grid Column property is a shorthand property that specifies a grid Items size with the column. See Examples here: https://www.w3schools.com/cssref/pr_grid-column.php',
		cssAttr: true,
		cssAttrVal: true
	},
	gridRow: {
		type: 'string',
		desc: 'The Grid row property is a shorthand property that specifies a grid Items size with the row. See Examples here: https://www.w3schools.com/cssref/pr_grid-row.php',
		cssAttr: true,
		cssAttrVal: true
	},
	gridTemplate: {
		type: 'string',
		desc: 'Used to define the grid areas using templates. See examples here: https://www.w3schools.com/cssref/pr_grid-template.php',
		cssAttr: true,
		cssAttrVal: true
	},
	gridTemplateColumns: {
		type: 'string',
		desc: 'Defines the column structure of the grid layout. You can specify column sizes and the number of columns using values such as pixels, percentages, or fractional units (fr). See examples here: https://www.w3schools.com/cssref/pr_grid-template-columns.asp',
		cssAttr: true,
		cssAttrVal: true
	},
	rowGap: {
		type: 'string',
		desc: 'Used to set the size of gap between elements rows',
		cssAttr: true,
		cssAttrVal: mapToSize
	},

	loadingClassName: {
		type: 'string',
		desc: 'When set, overrides the class name that is applied to components when they are loading (which is defaulted to "loading"). This can be used to force components not to show a loading mask when they are loading'
	},
	style: {
		type: 'object',
		desc: 'Custom styles to apply to the component',
		spec: { '.cpnContainer': { p: { 'text-align': 'justify' } } }
	},

	//Below are classMapped properties
	loading: {
		type: 'boolean',
		desc: 'When set to true, the component will have a loading mask + icon rendered over it (unless loadingClassName has a value, in which case that will be used instead)',
		classMap: (v, { loadingClassName }) => {
			if (v !== true)
				return;

			return loadingClassName ?? 'loading';
		}
	}
};

export default Object.assign(
	props,
	positioningProps,
	overlayProps,
	animationProps
);
