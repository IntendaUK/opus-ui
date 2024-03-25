/* eslint-disable max-lines */

const actions = [
	{
		type: 'stringify',
		keys: [
			{
				key: 'value',
				type: 'mixed',
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'scrollComponent',
		keys: [
			{
				key: 'target',
				type: 'string'
			},
			{
				key: 'targetSelector',
				type: 'string'
			},
			{
				key: 'targetSelectorAll',
				type: 'string'
			},
			{
				key: 'scrollPositionX',
				type: 'integer'
			},
			{
				key: 'scrollPositionY',
				type: 'integer'
			},
			{
				key: 'smooth',
				type: 'boolean'
			}
		]
	},
	{
		type: 'setState',
		keys: [
			{
				key: 'target',
				type: 'string',
				mandatory: true
			},
			{
				key: 'key',
				type: 'string'
			},
			{
				key: 'value',
				type: 'mixed',
				mandatory: true
			}
		]
	},
	{
		type: 'morphKeys',
		keys: [
			{
				key: 'value',
				type: 'object',
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'morphKeys',
		keys: [
			{
				key: 'value',
				type: 'object',
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'morphEntries',
		keys: [
			{
				key: 'value',
				type: 'object',
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'copyToClipboard',
		keys: [
			{
				key: 'value',
				type: 'mixed',
				mandatory: true
			}
		]
	},
	{
		type: 'getComponentPosition',
		keys: [
			{
				key: 'target',
				type: 'string'
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'getComponentHeight',
		keys: [
			{
				key: 'target',
				type: 'string'
			},
			{
				key: 'getScrollHeight',
				type: 'boolean'
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'getComponentWidth',
		keys: [
			{
				key: 'target',
				type: 'string'
			},
			{
				key: 'getScrollWidth',
				type: 'boolean'
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'mapArray',
		keys: [
			{
				key: 'id',
				type: 'string',
				mandatory: true
			},
			{
				key: 'value',
				type: 'object',
				mandatory: true
			},
			{
				key: 'mapTo',
				type: 'object',
				mandatory: true
			},
			{
				key: 'recordVarName',
				type: 'string'
			},
			{
				key: 'rowNumVarName',
				type: 'string'
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'reduceArray',
		keys: [
			{
				key: 'value',
				type: 'array',
				mandatory: true
			},
			{
				key: 'initialValue',
				type: 'mixed',
				mandatory: true
			},
			{
				key: 'field',
				type: 'string'
			},
			{
				key: 'reduction',
				type: 'stringOrObject',
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'wait',
		keys: [
			{
				key: 'duration',
				type: 'integer'
			}
		]
	},
	{
		type: 'setTagState',
		keys: [
			{
				key: 'target',
				type: 'string'
			},
			{
				key: 'key',
				type: 'string'
			},
			{
				key: 'value',
				type: 'mixed',
				mandatory: true
			}
		]
	},
	{
		type: 'pushVariable',
		keys: [
			{
				key: 'name',
				type: 'string',
				mandatory: true
			},
			{
				key: 'value',
				type: 'mixed',
				mandatory: true
			},
			{
				key: 'scope',
				type: 'string'
			}
		]
	},
	{
		type: 'popVariable',
		keys: [
			{
				key: 'name',
				type: 'string',
				mandatory: true
			},
			{
				key: 'scope',
				type: 'string'
			}
		]
	},
	{
		type: 'splitString',
		keys: [
			{
				key: 'value',
				type: 'string',
				mandatory: true
			},
			{
				key: 'separator',
				type: 'string',
				mandatory: true
			},
			{
				key: 'removeWhitespace',
				type: 'boolean'
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'joinArray',
		keys: [
			{
				key: 'value',
				type: 'string',
				mandatory: true
			},
			{
				key: 'separator',
				type: 'string',
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'showNotification',
		keys: [
			{
				key: 'target',
				type: 'string'
			},
			{
				key: 'msgType',
				type: 'string'
			},
			{
				key: 'autoClose',
				type: 'boolean'
			},
			{
				key: 'isGlobal',
				type: 'boolean'
			},
			{
				key: 'msg',
				type: 'string',
				mandatory: true
			},
			{
				key: 'duration',
				type: 'integer'
			}
		]
	},
	{
		type: 'setMultiState',
		keys: [
			{
				key: 'target',
				type: 'string'
			},
			{
				key: 'value',
				type: 'object',
				mandatory: true
			}
		]
	},
	{
		type: 'stopScript',
		keys: [
			{
				key: 'condition',
				type: 'object',
				mandatory: true
			}
		]
	},
	{
		type: 'morphIterateArray',
		keys: [
			{
				key: 'id',
				type: 'string'
			},
			{
				key: 'value',
				type: 'array',
				mandatory: true
			},
			{
				key: 'chain',
				type: 'array',
				mandatory: true
			},
			{
				key: 'recordVarName',
				type: 'string'
			},
			{
				key: 'rowNumVarName',
				type: 'string'
			}
		]
	},
	{
		type: 'applyComparison',
		keys: [
			{
				key: 'operator',
				type: 'string',
				mandatory: true
			},
			{
				key: 'value',
				type: 'mixed'
			},
			{
				key: 'compareValue',
				type: 'mixed'
			},
			{
				key: 'comparisons',
				type: 'array'
			},
			{
				key: 'branch',
				type: 'object',
				mandatory: true
			},
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
		type: 'log',
		keys: [
			{
				key: 'msg',
				type: 'string',
				mandatory: true
			}
		]
	},
	{
		type: 'clone',
		keys: [
			{
				key: 'value',
				type: 'mixed',
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'setVariable',
		keys: [
			{
				key: 'name',
				type: 'string',
				mandatory: true
			},
			{
				key: 'value',
				type: 'mixed',
				mandatory: true
			},
			{
				key: 'scope',
				type: 'string'
			}
		]
	},
	{
		type: 'setVariableKey',
		keys: [
			{
				key: 'name',
				type: 'string',
				mandatory: true
			},
			{
				key: 'key',
				type: 'string',
				mandatory: true
			},
			{
				key: 'value',
				type: 'mixed',
				mandatory: true
			},
			{
				key: 'scope',
				type: 'string'
			}
		]
	},
	{
		type: 'deleteVariables',
		keys: [
			{
				key: 'variables',
				type: 'array',
				mandatory: true
			},
			{
				key: 'scope',
				type: 'string'
			}
		]
	},
	{
		type: 'deleteVariable',
		keys: [
			{
				key: 'name',
				type: 'string',
				mandatory: true
			},
			{
				key: 'scope',
				type: 'string'
			}
		]
	},
	{
		type: 'findInArray',
		keys: [
			{
				key: 'id',
				type: 'string'
			},
			{
				key: 'value',
				type: 'array',
				mandatory: true
			},
			{
				key: 'comparison',
				type: 'object',
				mandatory: true
			},
			{
				key: 'recordVarName',
				type: 'string'
			},
			{
				key: 'rowNumVarName',
				type: 'string'
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'findIndexInArray',
		keys: [
			{
				key: 'id',
				type: 'string'
			},
			{
				key: 'value',
				type: 'array',
				mandatory: true
			},
			{
				key: 'comparison',
				type: 'object',
				mandatory: true
			},
			{
				key: 'recordVarName',
				type: 'string'
			},
			{
				key: 'rowNumVarName',
				type: 'string'
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'queueDelayedActions',
		keys: [
			{
				key: 'actions',
				type: 'array',
				mandatory: true
			},
			{
				key: 'delay',
				type: 'integer',
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'cancelDelayedActions',
		keys: [
			{
				key: 'delayId',
				type: 'string',
				mandatory: true
			}
		]
	},
	{
		type: 'queueIntervalActions',
		keys: [
			{
				key: 'actions',
				type: 'array',
				mandatory: true
			},
			{
				key: 'delay',
				type: 'integer',
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'cancelIntervalActions',
		keys: [
			{
				key: 'intervalId',
				type: 'string',
				mandatory: true
			}
		]
	},
	{
		type: 'setVariables',
		keys: [
			{
				key: 'variables',
				type: 'object',
				mandatory: true
			},
			{
				key: 'scope',
				type: 'string'
			}
		]
	},
	{
		type: 'forLoop',
		keys: [
			{
				key: 'id',
				type: 'string'
			},
			{
				key: 'loopId',
				type: 'string'
			},
			{
				key: 'count',
				type: 'integer',
				mandatory: true
			},
			{
				key: 'actions',
				type: 'array',
				mandatory: true
			},
			{
				key: 'rowNumberVarName',
				type: 'string'
			}
		]
	},
	{
		type: 'spliceArray',
		keys: [
			{
				key: 'value',
				type: 'array',
				mandatory: true
			},
			{
				key: 'index',
				type: 'integer',
				mandatory: true
			},
			{
				key: 'insertValue',
				type: 'mixed'
			},
			{
				key: 'removeCount',
				type: 'integer'
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'filterArray',
		keys: [
			{
				key: 'id',
				type: 'string'
			},
			{
				key: 'value',
				type: 'array',
				mandatory: true
			},
			{
				key: 'condition',
				type: 'object',
				mandatory: true
			},
			{
				key: 'recordVarName',
				type: 'string'
			},
			{
				key: 'rowNumVarName',
				type: 'string'
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'parseJson',
		keys: [
			{
				key: 'value',
				type: 'mixed',
				mandatory: true
			},
			{
				key: 'errorResult',
				type: 'mixed'
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'morphFromEntries',
		keys: [
			{
				key: 'value',
				type: 'mixed',
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'openLinkInTab',
		keys: [
			{
				key: 'value',
				type: 'string',
				mandatory: true
			},
			{
				key: 'lookupOptions',
				type: 'array'
			}
		]
	},
	{
		type: 'createFlow',
		keys: [
			{
				key: 'value',
				type: 'mixed'
			},
			{
				key: 'valueList',
				type: 'array'
			},
			{
				key: 'from',
				type: 'string'
			},
			{
				key: 'fromList',
				type: 'string'
			},
			{
				key: 'fromKey',
				type: 'string'
			},
			{
				key: 'fromKeyList',
				type: 'string'
			},
			{
				key: 'fromSubKey',
				type: 'string'
			},
			{
				key: 'fromSubKeyList',
				type: 'string'
			},
			{
				key: 'to',
				type: 'string'
			},
			{
				key: 'toList',
				type: 'string'
			},
			{
				key: 'toTag',
				type: 'string'
			},
			{
				key: 'toKey',
				type: 'string'
			},
			{
				key: 'toSubKey',
				type: 'string'
			},
			{
				key: 'toKeyList',
				type: 'string'
			},
			{
				key: 'mapFunctionString',
				type: 'string'
			},
			{
				key: 'scope',
				type: 'string'
			},
			{
				key: 'mapObject',
				type: 'string'
			}
		]
	},
	{
		type: 'allCpnsHaveStates',
		keys: [
			{
				key: 'operator',
				type: 'string',
				mandatory: true
			},
			{
				key: 'comparisons',
				type: 'array',
				mandatory: true
			},
			{
				key: 'branch',
				type: 'object'
			},
			{
				key: 'sourceTag',
				type: 'string'
			},
			{
				key: 'sourceList',
				type: 'array'
			}
		]
	},
	{
		type: 'clearPersistedStates',
		keys: [
			{
				key: 'config',
				type: 'array',
				mandatory: true
			}
		]
	},
	{
		type: 'concatArray',
		keys: [
			{
				key: 'value',
				type: 'array',
				mandatory: true
			},
			{
				key: 'concatValue',
				type: 'array',
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'defineFunction',
		keys: [
			{
				key: 'name',
				type: 'string',
				mandatory: true
			},
			{
				key: 'acceptArgs',
				type: 'object'
			},
			{
				key: 'fn',
				type: 'string'
			}
		]
	},
	{
		type: 'doesComponentOverflow',
		keys: [
			{
				key: 'target',
				type: 'string',
				mandatory: true
			},
			{
				key: 'axisX',
				type: 'boolean'
			},
			{
				key: 'axisY',
				type: 'boolean'
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'evalUnsafeJS',
		keys: [
			{
				key: 'value',
				type: 'string',
				mandatory: true
			}
		]
	},
	{
		type: 'exitLoop',
		keys: [
			{
				key: 'loopIds',
				type: 'array',
				mandatory: true
			}
		]
	},
	{
		type: 'generateRandomInteger',
		keys: [
			{
				key: 'min',
				type: 'integer'
			},
			{
				key: 'max',
				type: 'integer'
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'getData',
		keys: [
			{
				key: 'dtaObj',
				type: 'string',
				mandatory: true
			},
			{
				key: 'filters',
				type: 'array',
				mandatory: true
			},
			{
				key: 'offset',
				type: 'integer'
			},
			{
				key: 'pageSize',
				type: 'integer'
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'getFileDataUrl',
		keys: [
			{
				key: 'target',
				type: 'string',
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'getNextComponentId',
		keys: [
			{
				key: 'startAtId',
				type: 'string'
			},
			{
				key: 'allowCircular',
				type: 'boolean'
			},
			{
				key: 'parentId',
				type: 'string'
			},
			{
				key: 'match',
				type: 'object'
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'loadExternalJs',
		keys: [
			{
				key: 'src',
				type: 'string',
				mandatory: true
			},
			{
				key: 'attributes',
				type: 'object'
			}
		]
	},
	{
		type: 'openUrl',
		keys: [
			{
				key: 'url',
				type: 'string',
				mandatory: true
			}
		]
	},
	{
		type: 'queryUrl',
		keys: [
			{
				key: 'method',
				type: 'string',
				mandatory: true
			},
			{
				key: 'url',
				type: 'string',
				mandatory: true
			},
			{
				key: 'body',
				type: 'object',
				mandatory: true
			},
			{
				key: 'extractResults',
				type: 'array'
			},
			{
				key: 'extractErrors',
				type: 'array'
			},
			{
				key: 'extractAny',
				type: 'array'
			}
		]
	},
	{
		type: 'resolveScopedId',
		keys: [
			{
				key: 'id',
				type: 'string'
			},
			{
				key: 'scopedId',
				type: 'string',
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'scrollToComponent',
		keys: [
			{
				key: 'target',
				type: 'string',
				mandatory: true
			},
			{
				key: 'smooth',
				type: 'boolean'
			},
			{
				key: 'alignVertical',
				type: 'string'
			},
			{
				key: 'alignHorizontal',
				type: 'string'
			}
		]
	},
	{
		type: 'setPageFavicon',
		keys: [
			{
				key: 'path',
				type: 'string',
				mandatory: true
			}
		]
	},
	{
		type: 'setPageTitle',
		keys: [
			{
				key: 'title',
				type: 'string',
				mandatory: true
			}
		]
	},
	{
		type: 'toggleLayoutDebug',
		keys: [
			{
				key: 'on',
				type: 'boolean'
			}
		]
	},
	{
		type: 'deleteVariableKey',
		keys: [
			{
				key: 'name',
				type: 'string',
				mandatory: true
			},
			{
				key: 'scope',
				type: 'string'
			},
			{
				key: 'key',
				type: 'string'
			}
		]
	},
	{
		type: 'getState',
		keys: [
			{
				key: 'source',
				type: 'string',
				mandatory: true
			},
			{
				key: 'key',
				type: 'string'
			}
		]
	},
	{
		type: 'updateTheme',
		keys: [
			{
				key: 'theme',
				type: 'string',
				mandatory: true
			},
			{
				key: 'key',
				type: 'string'
			},
			{
				key: 'value',
				type: 'string'
			}
		]
	},
	{
		type: 'morphValues',
		keys: [
			{
				key: 'value',
				type: 'object',
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'morphTypeOf',
		keys: [
			{
				key: 'value',
				type: 'object',
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'morphKeyPath',
		keys: [
			{
				key: 'value',
				type: 'object',
				mandatory: true
			},
			{
				key: 'path',
				type: 'string',
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'generateGuid',
		keys: [
			{
				key: 'storeAsVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'getTheme',
		keys: [
			{
				key: 'name',
				type: 'string',
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				type: 'string'
			}
		]
	},
	{
		type: 'resetTheme',
		keys: [
			{
				key: 'theme',
				type: 'array',
				mandatory: true
			}
		]
	},
	{
		type: 'loadPersistedStates',
		keys: [
			{
				key: 'config',
				type: 'array',
				mandatory: true
			}
		]
	},
	{
		type: 'persistState',
		keys: [
			{
				key: 'config',
				type: 'array',
				mandatory: true,
				spec: [
					{
						key: 'id',
						type: 'string'
					},
					{
						key: 'key',
						type: 'string'
					},
					{
						key: 'subKey',
						type: 'string'
					},
					{
						key: 'scope',
						type: 'string'
					}
				]
			}
		]
	},
	{
		type: 'getPropSpec',
		keys: [
			{
				key: 'cpnType',
				type: 'object',
				mandatory: true
			}
		]
	}
];

export default actions;
