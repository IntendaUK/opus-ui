const systemComponents = [
	{
		id: 'POPUP1',
		type: 'popup'
	},
	{
		id: 'SCRIPTRUNNER',
		type: 'scriptRunner'
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

