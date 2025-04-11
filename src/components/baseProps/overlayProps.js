/* eslint-disable max-len */

//Helpers
import spliceWhere from '@spliceWhere';

//Props
const props = {
	popoverMda: {
		type: 'array',
		desc: 'Additional metadata that should be rendered "over" the component. This can be anything from tooltips, to badges to ad-hoc metadata',
		spec: [{
			position: 'Same options as tooltipPosition',
			popoverContainer: 'The id of the parent container. Defaults to the popovers system component',
			popoverZIndex: 'Sets the zIndex of the popover element',
			mda: {}
		}],
		setAction: (oldValue = [], newValue) => {
			if (!newValue.push)
				newValue = [ newValue];

			newValue.forEach(n => {
				const { id: nId } = n;

				//Ad-hoc popoverMda entries will normally not have popoverId's, but tooltips DO. Any popoverMda that you wish to be
				// able to remove as the result of, for example, a flow, will need a popoverId.
				if (nId !== undefined)
					spliceWhere(oldValue, ({ id }) => id === nId);

				oldValue.push(n);
			});

			return oldValue;
		},
		deleteAction: (oldValue = [], deletedValue) => {
			const { id } = deletedValue;
			if (id === undefined)
				return;

			spliceWhere(oldValue, o => o.id === id);

			return oldValue;
		}
	},
	contextMenu: {
		type: 'object',
		desc: 'Informs the system that right-clicking on the component should open a context menu. Refer to the ContextManuManager component properties for more info',
		spec: {
			items: 'array',
			mda: 'object'
		}
	},
	tooltipBlueprint: {
		type: 'string',
		desc: 'The path to the blueprint that should be used for tooltips',
		dft: ({ tooltip }) => {
			if (tooltip !== undefined)
				return 'system/tooltips/basic';
		}
	},
	tooltip: {
		type: 'string',
		desc: 'The tooltip for the component that should be displayed when hovering over it'
	},
	tooltipPosition: {
		type: 'string',
		desc: 'Defines where the tooltip should be displayed relative to the component',
		options: [
			'auto',
			'auto-start',
			'auto-end',
			'top',
			'top-start',
			'top-end',
			'bottom',
			'bottom-start',
			'bottom-end',
			'right',
			'right-start',
			'right-end',
			'left',
			'left-start',
			'left-end'
		],
		dft: ({ tooltip }) => {
			if (tooltip !== undefined)
				return 'top';
		}
	},
	tooltipZIndex: {
		type: 'number',
		desc: 'Specifies the z-index for the component\'s tooltip',
		dft: ({ tooltip }) => {
			if (tooltip !== undefined)
				return 1;
		}
	}
};

export default props;
