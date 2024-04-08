/* eslint-disable max-lines, max-len */

const triggers = [
	{
		key: 'onMount',
		desc: 'A trigger which is fired when a component first mounts',
		type: 'string',
		keys: [
			{
				key: 'source',
				desc: 'The id (static or scoped) of the component that the trigger will listen on',
				type: 'string'
			},
			{
				key: 'sourceList',
				desc: 'A list source ids (static or scoped) of components that the trigger will listen on',
				type: 'array'
			},
			{
				key: 'snapshotKeys',
				desc: 'An array of keys. The state values of these keys (on the source component) will be put into variables called "snapshot-"%key%',
				type: 'array'
			},
			{
				key: 'lateBound',
				desc: 'When the source has a scoped id and we know that the source component will remount multiple times (giving the component a new static id every time), we set lateBound to true otherwise the source id will be mapped once and then never reflect the correct id again',
				type: 'boolean'
			}
		]
	},
	{
		key: 'onUnmount',
		desc: 'A trigger which will fire when a component is unmounted',
		type: 'string',
		keys: [
			{
				key: 'source',
				desc: 'The id (static or scoped) of the component that the trigger will listen on',
				type: 'string'
			},
			{
				key: 'snapshotKeys',
				desc: 'An array of keys. The state values of these keys (on the source component) will be put into variables called "snapshot-"%key%',
				type: 'array'
			},
			{
				key: 'lateBound',
				desc: 'When the source has a scoped id and we know that the source component will remount multiple times (giving the component a new static id every time), we set lateBound to true otherwise the source id will be mapped once and then never reflect the correct id again',
				type: 'boolean'
			}
		]
	},
	{
		key: 'onStateChange',
		desc: 'A trigger which will fire when the state has changed on a component',
		type: 'string',
		keys: [
			{
				key: 'source',
				desc: 'The id (static or scoped) of the component that the trigger will listen on',
				type: 'string'
			},
			{
				key: 'sourceList',
				desc: 'A list source ids (static or scoped) of components that the trigger will listen on',
				type: 'array'
			},
			{
				key: 'sourceTag',
				desc: 'The tag of the components that the trigger will listen on',
				type: 'string'
			},
			{
				key: 'key',
				desc: 'The key that the trigger will listen to',
				type: 'string'
			},
			{
				key: 'keyList',
				desc: 'The keys that the trigger will listen to, used in conjunction with event: "onStateChange"',
				type: 'string'
			},
			{
				key: 'ignoreEmpty',
				desc: 'Used when the source value is a string. When this key is set to true, the trigger will not fire when the source value is an empty string',
				type: 'boolean'
			},
			{
				key: 'snapshotKeys',
				desc: 'An array of keys. The state values of these keys (on the source component) will be put into variables called "snapshot-"%key%',
				type: 'array'
			},
			{
				key: 'lateBound',
				desc: 'When the source has a scoped id and we know that the source component will remount multiple times (giving the component a new static id every time), we set lateBound to true otherwise the source id will be mapped once and then never reflect the correct id again',
				type: 'boolean'
			}
		]
	},
	{
		key: 'onComponentChildrenChanged',
		desc: "A trigger which will fire when states on a component's children have changed",
		type: 'string',
		keys: [
			{
				key: 'source',
				desc: 'The id (static or scoped) of the component that the trigger will listen on',
				type: 'string'
			},
			{
				key: 'lateBound',
				desc: 'When the source has a scoped id and we know that the source component will remount multiple times (giving the component a new static id every time), we set lateBound to true otherwise the source id will be mapped once and then never reflect the correct id again',
				type: 'boolean'
			}
		]
	},
	{
		key: 'onComponentResized',
		desc: 'A trigger which will fire when a component has been resized',
		type: 'string',
		keys: [
			{
				key: 'source',
				desc: 'The id (static or scoped) of the component that the trigger will listen on',
				type: 'string'
			},
			{
				key: 'sourceSelector',
				desc: 'The CSS selector of the component to listen on for resize changes',
				type: 'string'
			},
			{
				key: 'lateBound',
				desc: 'When the source has a scoped id and we know that the source component will remount multiple times (giving the component a new static id every time), we set lateBound to true otherwise the source id will be mapped once and then never reflect the correct id again',
				type: 'boolean'
			}
		]
	},
	{
		key: 'onConnectionLost',
		desc: 'A trigger which will fire when Opus loses internet connection',
		type: 'string',
		keys: []
	},
	{
		key: 'onConnectionRestored',
		desc: 'A trigger which will fire when Opus re-gains internet connection',
		type: 'string',
		keys: []
	},
	{
		key: 'onInterval',
		desc: 'A trigger which fires every %delay% milliseconds',
		type: 'string',
		keys: [
			{
				key: 'delay',
				desc: 'The delay (in ms) that the interval should wait before running again',
				type: 'integer'
			}
		]
	},
	{
		key: 'onPlatformCrash',
		desc: 'A trigger which will fire in situations where Opus has crashed',
		type: 'string',
		keys: []
	},
	{
		key: 'onScrollComponent',
		desc: 'A trigger which fires when a component is scrolled',
		type: 'string',
		keys: [
			{
				key: 'source',
				desc: 'The id (static or scoped) of the component that the trigger will listen on',
				type: 'string'
			},
			{
				key: 'sourceSelector',
				desc: 'The CSS selector of the component to listen on for resize changes',
				type: 'string'
			},
			{
				key: 'debounceDelay',
				desc: 'A duration to wait before the event is triggered after scroll',
				type: 'integer'
			}
		]
	},
	{
		key: 'onAllMounted',
		desc: 'A trigger which will fire when all components in sourceList have mounted',
		type: 'string',
		keys: [
			{
				key: 'sourceList',
				desc: 'A list source ids (static or scoped) of components that the trigger will listen on',
				type: 'array'
			},
			{
				key: 'lateBound',
				desc: 'When the source has a scoped id and we know that the source component will remount multiple times (giving the component a new static id every time), we set lateBound to true otherwise the source id will be mapped once and then never reflect the correct id again',
				type: 'boolean'
			}
		]
	},
	{
		key: 'onWindowResized',
		desc: 'A trigger which will fire the window is resized',
		type: 'string',
		keys: []
	},
	{
		key: 'onKeyDown',
		desc: 'A trigger which will fire when any key is pressed on the keyboard',
		type: 'string',
		keys: [
			{
				key: 'source',
				desc: 'The id (static or scoped) of the component that the trigger will listen on',
				type: 'string'
			},
			{
				key: 'match',
				desc: 'A list of comparisons that are matched against, when determining if the trigger should run',
				type: 'array'
			},
			{
				key: 'matchEvaluation',
				desc: 'A type of evaluation that should be performed for the match e.g. "some", "none" etc',
				type: 'string'
			},
			{
				key: 'consumeEventOnUse',
				desc: 'When set to true, the event will consume. For example, when consuming a character while focused on an input, the character will not be typed into the input',
				type: 'boolean'
			}
		]
	},
	{
		key: 'onGlobalKeyDown',
		desc: 'A trigger which will fire when any key is pressed on the keyboard, which is outside the context of this component',
		type: 'string',
		keys: [
			{
				key: 'source',
				desc: 'The id (static or scoped) of the component that the trigger will listen on',
				type: 'string'
			},
			{
				key: 'match',
				desc: 'A list of comparisons that are matched against, when determining if the trigger should run',
				type: 'array'
			},
			{
				key: 'matchEvaluation',
				desc: 'A type of evaluation that should be performed for the match e.g. "some", "none" etc',
				type: 'string'
			},
			{
				key: 'consumeEventOnUse',
				desc: 'When set to true, the event will consume. For example, when consuming F5, the browser will not refresh',
				type: 'boolean'
			}
		]
	},
	{
		key: 'onFocus',
		desc: 'A trigger which will fire when a component is focused',
		type: 'string',
		keys: [
			{
				key: 'source',
				desc: 'The id (static or scoped) of the component that the trigger will listen on',
				type: 'string'
			},
			{
				key: 'snapshotKeys',
				desc: 'An array of keys. The state values of these keys (on the source component) will be put into variables called "snapshot-"%key%',
				type: 'array'
			}
		]
	},
	{
		key: 'onBlur',
		desc: 'A trigger which will fire when a component loses focus',
		type: 'string',
		keys: [
			{
				key: 'source',
				desc: 'The id (static or scoped) of the component that the trigger will listen on',
				type: 'string'
			},
			{
				key: 'snapshotKeys',
				desc: 'An array of keys. The state values of these keys (on the source component) will be put into variables called "snapshot-"%key%',
				type: 'array'
			}
		]
	},
	{
		key: 'onSelect',
		desc: 'A trigger which will fire when a text is selected',
		type: 'string',
		keys: [
			{
				key: 'source',
				desc: 'The id (static or scoped) of the component that the trigger will listen on',
				type: 'string'
			},
			{
				key: 'snapshotKeys',
				desc: 'An array of keys. The state values of these keys (on the source component) will be put into variables called "snapshot-"%key%',
				type: 'array'
			}
		]
	}
];

export default triggers;
