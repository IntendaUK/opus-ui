const triggers = [
	{
		event: 'onStateChange',
		keys: [
			{
				key: 'source',
				type: 'string'
			},
			{
				key: 'key',
				type: 'string'
			}
		]
	},
	{
		event: 'onMount',
		keys: [
			{
				key: 'source',
				type: 'string'
			}
		]
	},
	{
		event: 'onUnmount',
		keys: [
			{
				key: 'source',
				type: 'string'
			}
		]
	},
	{
		event: 'onKeyDown',
		keys: [
			{
				key: 'source',
				type: 'string'
			},
			{
				key: 'matchEvaluation',
				type: 'string'
			},
			{
				key: 'match',
				type: 'array'
			}
		]
	},
	{
		event: 'onGlobalKeyDown',
		keys: [
			{
				key: 'source',
				type: 'string'
			},
			{
				key: 'match',
				type: 'array'
			}
		]
	},
	{
		event: 'onComponentChildrenChanged',
		keys: [
			{
				key: 'source',
				type: 'string'
			},
			{
				key: 'lateBound',
				type: 'boolean'
			}
		]
	},
	{
		event: 'onComponentResized',
		keys: [
			{
				key: 'source',
				type: 'string'
			},
			{
				key: 'lateBound',
				type: 'boolean'
			}
		]
	},
	{
		event: 'onConnectionLost',
		keys: []
	},
	{
		event: 'onConnectionRestored',
		keys: []
	},
	{
		event: 'onInterval',
		keys: []
	},
	{
		event: 'onPlatformCrash',
		keys: []
	},
	{
		event: 'onScrollComponent',
		keys: [
			{
				key: 'source',
				type: 'string'
			}
		]
	},
	{
		event: 'onWindowResized',
		keys: []
	}
];

export default triggers;
