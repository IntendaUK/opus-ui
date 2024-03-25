/* eslint-disable max-len */
const props = {
	autoTab: {
		type: 'boolean',
		desc: 'When true, all items opened in the viewport should be opened as a tab'
	},
	ctrlTab: {
		type: 'boolean',
		desc: 'When true, holding control while clicking on a menu item will cause the dashboard to open as a tab',
		dft: false
	},
	ctrlDown: {
		type: 'boolean',
		desc: 'An internal prop which becomes registered when the user is pressing the ctrl key',
		internal: true
	},
	value: {
		type: 'string',
		desc: 'The name of the dashboard to be opened',
		rememberLast: true
	},
	mda: {
		type: 'mixed',
		desc: 'The metadata of all dashboards that are being rendered'
	},
	inputMda: {
		type: 'object',
		desc: 'Contains the metadata that should be rendered in the viewport. Should not be used in conjunction with value'
	},
	tabsMda: {
		type: 'array',
		desc: 'The same as mda except for when there are multiple tabs being rendered',
		internal: true
	},
	oldValue: {
		type: 'mixed',
		desc: 'The name of the last dashboard that was opened',
		internal: true
	},
	hasCloseOption: {
		type: 'boolean',
		desc: 'When true, tabs can be closed from their context menus'
	}
};

export default props;
