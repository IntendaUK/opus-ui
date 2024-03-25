const systemComponents = [
	{
		id: 'MODAL1',
		type: 'modal',
		prps: { style: { '.cpnModal': { 'z-index': 100002 } } }
	},
	{
		id: 'MODAL2',
		type: 'modal'
	},
	{
		id: 'POPUP1',
		type: 'popup'
	},
	{
		id: 'SCRIPTRUNNER',
		type: 'scriptRunner'
	},
	{
		id: 'SYSMODAL',
		type: 'systemModal'
	},
	{
		id: 'CONTEXT1',
		type: 'contextMenuManager'
	},
	{
		id: 'POPOVERS',
		type: 'containerSimple',
		prps: {
			position: 'absolute',
			left: 0,
			top: 0,
			width: '100%',
			height: '100%',
			overflow: 'unset'
		}
	},
	{
		id: 'LOCALSTORAGEMANAGER',
		type: 'localStorageManager'
	},
	{
		id: 'EXTERNALS',
		type: 'container',
		prps: {
			position: 'absolute',
			pointerEvents: 'none'
		}
	}
];

export default systemComponents;

