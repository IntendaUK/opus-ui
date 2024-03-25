/* eslint-disable max-len */

const props = {
	display: {
		type: 'boolean',
		desc: 'When true, the context menu will be rendered',
		dft: false
	},
	items: {
		type: 'array',
		desc: 'Contains a list of items to be rendered inside the context menu. By default, when a record is selected, the action defined in the "script" field will be executed'
	},
	mda: {
		type: 'object',
		desc: 'Custom metadata that should be rendered inside the context menu'
	},
	x: {
		type: 'integer',
		desc: 'The x position that the context menu should appear at'
	},
	y: {
		type: 'integer',
		desc: 'The y position that the context menu should appear at'
	},
	source: {
		type: 'string',
		desc: 'The id of the component that requested for the context menu to be shown'
	},
	prpsContainer: {
		type: 'object',
		desc: 'An object containing the properties that should be rendered for the context menu container. Only relevant when items is sent in (not mda)',
		dft: () => ({
			backgroundColor: 'iconPrimary',
			shadow: true,
			border: '2px solid var(--colors-darkPrimary)',
			width: '200px'
		})
	},
	prpsGrid: {
		type: 'object',
		desc: 'An object containing the properties that should be rendered for the context menu grid. Only relevant when items is sent in (not mda)',
		dft: () => ({
			hasHeader: false,
			hasFilterBuilder: false,
			canManageColumns: false,
			hasToolbar: false,
			fireScriptKey: 'script'
		})
	},
	wgtsGrid: {
		type: 'array',
		desc: 'An array containing the columns that should be shown in the context menu grid. Only relevant when items is sent in (not mda) and should correlate with the fields in the items array. It is recommended that this is not overridden since all context menus need to adhere to the same specification',
		dft: () => [
			{ id: 'id' }
		]
	}
};

export default props;
