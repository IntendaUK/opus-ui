/* eslint-disable max-lines, max-len */

import operators from './configOperators';

const actions = [
	{
		key: 'stringify',
		desc: 'Converts a JavaScript value to a JavaScript Object Notation (JSON) string',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'A JavaScript value, usually an object or array, to be converted',
				type: ['string', 'integer', 'boolean', 'array', 'object'],
				mandatory: true
			},
			{
				key: 'spacer',
				desc: 'Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read',
				type: 'string'
			},
			{
				key: 'convertUndefinedToNull',
				desc: 'Converts any property values which are undefined (and thus removed from the returning JSON) into null, so that they still exist in the resulting JSON',
				type: 'boolean'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the resulting value to',
				type: 'string'
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the result to',
				type: 'string'
			}
		]
	},
	{
		key: 'scrollComponent',
		desc: 'Programmatically scrolls a target component',
		type: 'string',
		keys: [
			{
				key: 'target',
				desc: 'The id (static or scoped) of the component to scroll. This can be used instead of targetSelector',
				type: 'string'
			},
			{
				key: 'targetSelector',
				desc: 'The CSS selector of the component to scroll. This can be used instead of target',
				type: 'string'
			},
			{
				key: 'targetSelectorAll',
				desc: 'The CSS selector of the components to scroll. This can be used instead of target and targetSelector',
				type: 'string'
			},
			{
				key: 'scrollPositionX',
				desc: 'The number used to scroll the target along the X axis',
				type: 'integer'
			},
			{
				key: 'scrollPositionY',
				desc: 'The number used to scroll the target along the Y axis',
				type: 'integer'
			},
			{
				key: 'smooth',
				desc: 'Adds a smooth transition to the scroll',
				type: 'boolean'
			}
		]
	},
	{
		key: 'getState',
		desc: 'Gets a state from the source component',
		type: 'string',
		keys: [
			{
				key: 'source',
				desc: 'The id (static or scoped) of the component to get the state from',
				type: 'string',
				mandatory: true
			},
			{
				key: 'key',
				desc: 'The state key to get from the source component. Defaults to value',
				type: 'string'
			}
		]
	},
	{
		key: 'setState',
		desc: 'Sets a state on the target component',
		type: 'string',
		keys: [
			{
				key: 'target',
				desc: 'The id (static or scoped) of the component to set the state on. Defaults to ownerId',
				type: 'string',
				mandatory: true
			},
			{
				key: 'key',
				desc: 'The state key to set on the target component. Defaults to value',
				type: 'string'
			},
			{
				key: 'value',
				desc: 'The state value to set on the target component',
				type: ['string', 'integer', 'boolean', 'array', 'object'],
				mandatory: true
			}
		]
	},
	{
		key: 'copyToClipboard',
		desc: 'Copies the value supplied into the clipboard',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The value to be copied to the clipboard',
				type: ['string', 'integer', 'boolean', 'array', 'object'],
				mandatory: true
			}
		]
	},
	{
		key: 'getComponentPosition',
		desc: 'Gets the current position of the target component',
		type: 'string',
		keys: [
			{
				key: 'target',
				desc: 'The id (static or scoped) of the component to get the position from. Defaults to ownerId',
				type: 'string'
			},
			{
				key: 'getOffsetPosition',
				desc: 'When set to false, this action will return the position relative to the browser viewport. When set to true, this action will return the position of the component relative to the first parent it finds that has absolute positioning. Defaults to false',
				type: 'boolean'
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the result to',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the resulting value to',
				type: 'string'
			}
		]
	},
	{
		key: 'getComponentHeight',
		desc: 'Gets the height of the target component',
		type: 'string',
		keys: [
			{
				key: 'target',
				desc: 'The id (static or scoped) of the component to get the height from. Defaults to ownerId',
				type: 'string'
			},
			{
				key: 'getScrollHeight',
				desc: 'When set to true, this action returns the full height of the component (will only differ if the component scrolls vertically)',
				type: 'boolean'
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the result to',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the resulting value to',
				type: 'string'
			}
		]
	},
	{
		key: 'getComponentWidth',
		desc: 'Gets the width of the target component',
		type: 'string',
		keys: [
			{
				key: 'target',
				desc: 'The id (static or scoped) of the component to get the width from. Defaults to ownerId',
				type: 'string'
			},
			{
				key: 'getScrollWidth',
				desc: 'When set to true, this action returns the full width of the component (will only differ if the component scrolls horizontally)',
				type: 'boolean'
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the result to',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the resulting value to',
				type: 'string'
			}
		]
	},
	{
		key: 'mapArray',
		desc: 'Converts an array of entries into a new array of entries using mapTo property',
		type: 'string',
		keys: [
			{
				key: 'id',
				desc: 'The id of this action, to be used as a script action accessor',
				type: 'string'
			},
			{
				key: 'value',
				desc: 'The current value of the array',
				type: 'array',
				mandatory: true
			},
			{
				key: 'mapTo',
				desc: 'What each entry inside of the array should be mapped to',
				type: ['string', 'integer', 'boolean', 'array', 'object'],
				mandatory: true
			},
			{
				key: 'recordVarName',
				desc: 'The variable name given to each entry at each iteration. Defaults to "record"',
				type: 'string'
			},
			{
				key: 'rowNumVarName',
				desc: 'The variable name given to each entry\'s index at each iteration. Defaults to "rowNum"',
				type: 'string'
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the result to',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the resulting value to',
				type: 'string'
			}
		]
	},
	{
		key: 'reduceArray',
		desc: 'Converts an array of entries into a resulting value using reductions such as "add" or "concatenate"',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The current value of the array',
				type: 'array',
				mandatory: true
			},
			{
				key: 'initialValue',
				desc: 'The initial value of the new array',
				type: ['string', 'integer', 'boolean', 'array', 'object'],
				mandatory: true
			},
			{
				key: 'field',
				desc: 'The property key (or property path e.g: a.b.c) inside each entry to be used in the reduction',
				type: 'string'
			},
			{
				key: 'reduction',
				desc: 'A reduction type e.g. "add" or a reduction config to be used for the reduction',
				type: ['string', 'object'],
				mandatory: true,
				options: [
					{
						key: 'add',
						desc: 'Takes each entry inside of the array and sums them together',
						type: 'string'
					},
					{
						key: 'concatenate',
						desc: 'Takes each entry inside of the array and concatenates them together into a string',
						type: 'string'
					},
					{
						key: '{}',
						desc: 'A configuration object for the reduction',
						type: 'object',
						spec: {
							type: '%reductionType%',
							'...': '...reduction config options'
						}
					}
				]
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the result to',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the resulting value to',
				type: 'string'
			}
		]
	},
	{
		key: 'wait',
		desc: 'Pauses the script execution for %duration% milliseconds',
		type: 'string',
		keys: [
			{
				key: 'duration',
				desc: 'The duration in milliseconds to pause the script for',
				type: 'integer'
			}
		]
	},
	{
		key: 'setTagState',
		desc: 'Sets a state on each target component with the specified target tag',
		type: 'string',
		keys: [
			{
				key: 'target',
				desc: 'The tag of the components to set the state on',
				type: 'string',
				mandatory: true
			},
			{
				key: 'key',
				desc: 'The state key to set on each target component. Defaults to value',
				type: 'string'
			},
			{
				key: 'value',
				desc: 'The state value to set on each target component',
				type: ['string', 'integer', 'boolean', 'array', 'object'],
				mandatory: true
			}
		]
	},
	{
		key: 'pushVariable',
		desc: 'Pushes a new entry into an array of entries',
		type: 'string',
		keys: [
			{
				key: 'name',
				desc: 'The name of the script variable (the array) push the new entry to',
				type: 'string',
				mandatory: true
			},
			{
				key: 'value',
				desc: 'The new entry to push into the array',
				type: ['string', 'integer', 'boolean', 'array', 'object'],
				mandatory: true
			},
			{
				key: 'scope',
				desc: 'The script (or action) scope when performing this action',
				type: 'string'
			}
		]
	},
	{
		key: 'popVariable',
		desc: 'Removes the last element from an array of entries',
		type: 'string',
		keys: [
			{
				key: 'name',
				desc: 'The name of the script variable (the array) remove the last element from',
				type: 'string',
				mandatory: true
			},
			{
				key: 'scope',
				desc: 'The script (or action) scope when performing this action',
				type: 'string'
			}
		]
	},
	{
		key: 'splitString',
		desc: 'Splits a string into an array of strings',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The string value to split',
				type: 'string',
				mandatory: true
			},
			{
				key: 'separator',
				desc: 'An identifier in the string to split the string on',
				type: 'string',
				mandatory: true
			},
			{
				key: 'removeWhitespace',
				desc: 'Automatically removes whitespace from each entry and filters out entries that are empty strings. Defaults to false',
				type: 'boolean'
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the result to',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the resulting value to',
				type: 'string'
			}
		]
	},
	{
		key: 'joinArray',
		desc: 'Creates a string by concatenating all of the elements in an array',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The array of elements to join',
				type: 'string',
				mandatory: true
			},
			{
				key: 'separator',
				desc: 'The separator to join the elements by e.g: "," or "_"',
				type: 'string',
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the result to',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the resulting value to',
				type: 'string'
			}
		]
	},
	{
		key: 'showNotification',
		desc: 'Programmatically display a notification',
		type: 'string',
		keys: [
			{
				key: 'target',
				desc: 'The id (static or scoped) of the notifications component',
				type: 'string'
			},
			{
				key: 'msgType',
				desc: 'The type of notification to be displayed',
				type: 'string',
				options: [
					{
						key: 'info',
						desc: 'The "info" message type, mapped to the color: colorBackgroundInfo which is set where the notifications component is defined in your metadata',
						type: 'string'
					},
					{
						key: 'success',
						desc: 'The "success" message type, mapped to the color: colorBackgroundSuccess which is set where the notifications component is defined in your metadata',
						type: 'string'
					},
					{
						key: 'warning',
						desc: 'The "warning" message type, mapped to the color: colorBackgroundWarning which is set where the notifications component is defined in your metadata',
						type: 'string'
					},
					{
						key: 'danger',
						desc: 'The "danger" message type, mapped to the color: colorBackgroundDanger which is set where the notifications component is defined in your metadata',
						type: 'string'
					}
				]
			},
			{
				key: 'autoClose',
				desc: 'If the notification should automatically close. Defaults to true',
				type: 'boolean'
			},
			{
				key: 'isGlobal',
				desc: 'If the notification should be a native notification for the device instead of a HTML rendered one',
				type: 'boolean'
			},
			{
				key: 'msg',
				desc: 'The notification\'s message',
				type: 'string',
				mandatory: true
			},
			{
				key: 'duration',
				desc: 'The duration in milliseconds to display the notification for. Defaults to 3000ms',
				type: 'integer'
			}
		]
	},
	{
		key: 'setMultiState',
		desc: 'Sets multiple states at once on the target component',
		type: 'string',
		keys: [
			{
				key: 'target',
				desc: 'The id (static or scoped) of the component to set the state on. Defaults to ownerId',
				type: 'string'
			},
			{
				key: 'value',
				desc: 'An object of key value pairs. Keys define the state keys and the values are the associated state key values',
				type: 'object',
				mandatory: true
			}
		]
	},
	{
		key: 'stopScript',
		desc: 'Stops the script when a certain condition is met',
		type: 'string',
		keys: [
			{
				key: 'condition',
				desc: 'A comparison object defining when the script should be stopped',
				type: 'object',
				mandatory: true,
				spec: {
					operator: 'isEqual',
					value: '((s1.state.self.value))',
					compareValue: '((s1.variable.lastUsedValue))'
				}
			}
		]
	},
	{
		key: 'morphIterateArray',
		desc: 'Iterates over an array of entries and performs a chain of morphed actions using script accessors',
		type: 'string',
		keys: [
			{
				key: 'id',
				desc: 'The id of this action, to be used as a script action accessor',
				type: 'string'
			},
			{
				key: 'value',
				desc: 'The value of the array to iterate on',
				type: 'array',
				mandatory: true
			},
			{
				key: 'chain',
				desc: 'A list of actions to be performed on each iteration',
				type: 'array',
				mandatory: true
			},
			{
				key: 'recordVarName',
				desc: 'The variable name given to each entry at each iteration. Defaults to "record"',
				type: 'string'
			},
			{
				key: 'rowNumVarName',
				desc: 'The variable name given to each entry\'s index at each iteration. Defaults to "rowNum"',
				type: 'string'
			}
		]
	},
	{
		key: 'applyComparison',
		desc: 'Applies a comparison on the value and allows you to perform specific actions based on the result. \n See: [Opus Action: applyComparison](https://intenda.atlassian.net/wiki/x/AQAbE)',
		type: 'string',
		keys: [
			{
				key: 'operator',
				desc: 'The comparison operator to evaluate against',
				type: 'string',
				mandatory: true,
				options: operators
			},
			{
				key: 'value',
				desc: 'The value to be used in the comparison',
				type: ['string', 'integer', 'boolean', 'array', 'object']
			},
			{
				key: 'compareValue',
				desc: 'A compare value that\'s used in various comparisons',
				type: ['string', 'integer', 'boolean', 'array', 'object']
			},
			{
				key: 'comparisons',
				desc: 'A list of comparisons to be evaluated. Used in conjunction with "all", "some" or "none" operators',
				type: 'array'
			},
			{
				key: 'branch',
				desc: 'The chain of actions that will be executed when a condition is met',
				type: 'object',
				mandatory: true
			},
			{
				key: 'source',
				desc: 'The source component that this script is attached to. When supplied, the "value" property can be omitted so long as "key" is supplied',
				type: 'string'
			},
			{
				key: 'key',
				desc: 'The state key inside the source component to use for "value"',
				type: 'string'
			},
			{
				key: 'fields',
				desc: 'A list of component ids (static or scoped) e.g. ["id1", "id2"] to be used in the "doFieldsHaveValues" comparison operator',
				type: 'array'
			},
			{
				key: 'values',
				desc: 'A list of object records e.g. [{a: 1}, {b: 100}] to be used in the "doValuesDifferFromRecord" comparison operator. Used in conjunction with the "record" property',
				type: 'array'
			},
			{
				key: 'record',
				desc: 'A record e.g. {key: name, value: "Jon"} to be used in the "doValuesDifferFromRecord" comparison operator. Used in conjunction with the "values" property',
				type: 'object'
			}
		]
	},
	{
		key: 'log',
		desc: 'Logs a value to the console. Used for debugging purposes',
		type: 'string',
		keys: [
			{
				key: 'msg',
				desc: 'The value to be logged to the console',
				type: 'string',
				mandatory: true
			}
		]
	},
	{
		key: 'clone',
		desc: 'Deep clones an object',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The value to clone',
				type: ['string', 'array', 'object'],
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the result to',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the resulting value to',
				type: 'string'
			}
		]
	},
	{
		key: 'queryGateway',
		desc: 'Queries a gateway endpoint',
		type: 'string',
		keys: [
			{
				key: 'queryUrl',
				desc: 'The endpoint to query',
				type: 'string'
			},
			{
				key: 'cache',
				desc: 'Caches the response so it can be reused in subsequent requests',
				type: 'boolean'
			},
			{
				key: 'queryData',
				desc: 'The request body to be sent in the request',
				type: 'object',
				mandatory: true
			},
			{
				key: 'extractResults',
				desc: 'A list of extraction records specifying which values in the resulting dataset to save into variables',
				type: 'array',
				spec: [
					{
						path: 'response.success',
						variable: 'successful'
					},
					{
						path: 'response.result.0.serviceresult.response.records',
						variable: 'data'
					}
				]
			},
			{
				key: 'extractErrors',
				desc: 'A list of extraction records specifying which values in the resulting dataset to save into variables. Note this can only be used where requests failed',
				type: 'array'
			},
			{
				key: 'extractAny',
				desc: 'A list of extraction records specifying which values in the resulting dataset to save into variables',
				type: 'array'
			}
		]
	},
	{
		key: 'setVariable',
		desc: 'Sets a variable to be used within the script\'s scope',
		type: 'string',
		keys: [
			{
				key: 'scope',
				desc: 'The script (or action) scope to save the variable to',
				type: 'string'
			},
			{
				key: 'name',
				desc: 'The name of the variable',
				type: 'string',
				mandatory: true
			},
			{
				key: 'value',
				desc: 'The value of the variable',
				type: ['string', 'integer', 'boolean', 'array', 'object'],
				mandatory: true
			}
		]
	},
	{
		key: 'setVariables',
		desc: 'Sets variables to be used within the script\'s scope',
		type: 'string',
		keys: [
			{
				key: 'scope',
				desc: 'The script (or action) scope to save the variables to',
				type: 'string'
			},
			{
				key: 'variables',
				desc: 'An object of key value pairs. Each key value is the variable name and associated value',
				type: 'object',
				mandatory: true
			}
		]
	},
	{
		key: 'setVariableKey',
		desc: 'Sets a key and value within an existing variable object or array',
		type: 'string',
		keys: [
			{
				key: 'scope',
				desc: 'The script (or action) scope to retrieve the existing variable from',
				type: 'string'
			},
			{
				key: 'name',
				desc: 'The name of the existing variable to set the key inside',
				type: 'string',
				mandatory: true
			},
			{
				key: 'key',
				desc: 'A key or a path (e.g. obj.abc.newKey) to set inside the existing object',
				type: 'string',
				mandatory: true
			},
			{
				key: 'value',
				desc: 'The new value to set inside the object',
				type: ['string', 'integer', 'boolean', 'array', 'object'],
				mandatory: true
			}
		]
	},
	{
		key: 'deleteVariableKey',
		desc: 'Delete a specific key within an object variable',
		type: 'string',
		keys: [
			{
				key: 'name',
				desc: 'The name of the existing variable delete',
				type: 'string',
				mandatory: true
			},
			{
				key: 'scope',
				desc: 'The script (or action) scope when performing this action',
				type: 'string'
			},
			{
				key: 'key',
				desc: 'A key or a path (e.g. obj.abc.newKey) to set inside the existing object',
				type: 'string'
			}
		]
	},
	{
		key: 'setVariableKeys',
		desc: 'Sets multiple key and values within an existing variable object or array',
		type: 'string',
		keys: [
			{
				key: 'scope',
				desc: 'The script (or action) scope to retrieve the existing variable from',
				type: 'string'
			},
			{
				key: 'name',
				desc: 'The name of the existing variable to set the key inside',
				type: 'string',
				mandatory: true
			},
			{
				key: 'keyValues',
				desc: 'An object of key value pairs. Each property can be a key or a path (e.g. obj.abc.newKey) to set inside the existing object',
				type: 'object',
				mandatory: true
			}
		]
	},
	{
		key: 'deleteVariables',
		desc: 'Deletes variables from a script',
		type: 'string',
		keys: [
			{
				key: 'scope',
				desc: 'The script (or action) scope to remove the existing variables from',
				type: 'string'
			},
			{
				key: 'variables',
				desc: 'A list of variable names to be removed',
				type: 'array',
				mandatory: true
			}
		]
	},
	{
		key: 'deleteVariable',
		desc: 'Deletes a variable from a script',
		type: 'string',
		keys: [
			{
				key: 'scope',
				desc: 'The script (or action) scope to remove the existing variables from',
				type: 'string'
			},
			{
				key: 'name',
				desc: 'The name of variable to be removed',
				type: 'string',
				mandatory: true
			}
		]
	},
	{
		key: 'findInArray',
		desc: 'Finds an element inside an array based on a comparison',
		type: 'string',
		keys: [
			{
				key: 'id',
				desc: 'The id of this action, to be used as a script action accessor',
				type: 'string'
			},
			{
				key: 'value',
				desc: 'The value of the array to find the element within',
				type: 'array',
				mandatory: true
			},
			{
				key: 'comparison',
				desc: 'The comparison object',
				type: 'object',
				mandatory: true
			},
			{
				key: 'recordVarName',
				desc: 'The variable name given to each entry at each iteration. Defaults to "record"',
				type: 'string'
			},
			{
				key: 'rowNumVarName',
				desc: 'The variable name given to each entry\'s index at each iteration. Defaults to "rowNum"',
				type: 'string'
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the found element in',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the found element to',
				type: 'string'
			}
		]
	},
	{
		key: 'findIndexInArray',
		desc: 'Finds the index of an element inside an array based on a comparison',
		type: 'string',
		keys: [
			{
				key: 'id',
				desc: 'The id of this action, to be used as a script action accessor',
				type: 'string'
			},
			{
				key: 'value',
				desc: 'The value of the array to find the element within',
				type: 'array',
				mandatory: true
			},
			{
				key: 'comparison',
				desc: 'The comparison object',
				type: 'object',
				mandatory: true
			},
			{
				key: 'recordVarName',
				desc: 'The variable name given to each entry at each iteration. Defaults to "record"',
				type: 'string'
			},
			{
				key: 'rowNumVarName',
				desc: 'The variable name given to each entry\'s index at each iteration. Defaults to "rowNum"',
				type: 'string'
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the found element index in',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the found element index to',
				type: 'string'
			}
		]
	},
	{
		key: 'queueDelayedActions',
		desc: 'Queues actions to be executed after %delay% milliseconds',
		type: 'string',
		keys: [
			{
				key: 'id',
				desc: 'The id of this action, to be used as a script action accessor',
				type: 'string'
			},
			{
				key: 'actions',
				desc: 'The list of actions to be executed after the delay. Returns a "delayId" which can be used in actions like "cancelDelayedActions"',
				type: 'array',
				mandatory: true
			},
			{
				key: 'delay',
				desc: 'The delay in milliseconds to wait before executing the actions',
				type: 'integer',
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the delayId inside',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the delayId value to',
				type: 'string'
			}
		]
	},
	{
		key: 'cancelDelayedActions',
		desc: 'Cancels previously queued actions',
		type: 'string',
		keys: [
			{
				key: 'delayId',
				desc: 'A queue id which is returned from "queueDelayedActions"',
				type: 'string',
				mandatory: true
			}
		]
	},
	{
		key: 'queueIntervalActions',
		desc: 'Queues actions to be executed every %delay% milliseconds',
		type: 'string',
		keys: [
			{
				key: 'id',
				desc: 'The id of this action, to be used as a script action accessor',
				type: 'string'
			},
			{
				key: 'actions',
				desc: 'The list of actions to be executed after every delay. Returns a "intervalId" which can be used in actions like "cancelIntervalActions"',
				type: 'array',
				mandatory: true
			},
			{
				key: 'delay',
				desc: 'The interval delay in milliseconds to wait before executing the actions',
				type: 'integer',
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the intervalId inside',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the intervalId value to',
				type: 'string'
			}
		]
	},
	{
		key: 'cancelIntervalActions',
		desc: 'Cancels previously queued interval actions',
		type: 'string',
		keys: [
			{
				key: 'intervalId',
				desc: 'An interval id which is returned from "queueIntervalActions"',
				type: 'string',
				mandatory: true
			}
		]
	},
	{
		key: 'forLoop',
		desc: 'Loops until a %count% is equal to rowNumber',
		type: 'string',
		keys: [
			{
				key: 'id',
				desc: 'The id of this action, to be used as a script action accessor',
				type: 'string'
			},
			{
				key: 'loopId',
				desc: 'An id for the loop which is used in conjunction with the "exitLoop" action to break out of the loop',
				type: 'string'
			},
			{
				key: 'count',
				desc: 'The number of iterations to loop before the loop stops',
				type: 'integer',
				mandatory: true
			},
			{
				key: 'actions',
				desc: 'A chain of actions to be executed every time it loops',
				type: 'array',
				mandatory: true
			},
			{
				key: 'rowNumberVarName',
				desc: 'The variable name given to each index at each iteration. Defaults to "rowNumber"',
				type: 'string'
			}
		]
	},
	{
		key: 'exitLoop',
		desc: 'Exits one or more forLoop actions, given an array or loopIds',
		type: 'string',
		keys: [
			{
				key: 'loopIds',
				desc: 'A list of ids used to exit each loop',
				type: 'array',
				mandatory: true
			}
		]
	},
	{
		key: 'spliceArray',
		desc: 'Changes the content of an array by removing or replacing existing elements and/or adding new elements in place',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The array to be spliced',
				type: 'array',
				mandatory: true
			},
			{
				key: 'index',
				desc: 'The start index to begin the splice',
				type: 'integer',
				mandatory: true
			},
			{
				key: 'insertValue',
				desc: 'The value(s) to be inserted at the supplied index. Note if insertValue is an array, elements inside the insertValue will be spread in place',
				type: ['string', 'integer', 'boolean', 'array', 'object']
			},
			{
				key: 'removeCount',
				desc: 'The number of elements to remove at the supplied index. Defaults to 0',
				type: 'integer'
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the new array in',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the the new array value to',
				type: 'string'
			}
		]
	},
	{
		key: 'filterArray',
		desc: 'Filters an array of elements based on a comparison',
		type: 'string',
		keys: [
			{
				key: 'id',
				desc: 'The id of this action, to be used as a script action accessor',
				type: 'string'
			},
			{
				key: 'value',
				desc: 'The array that should be filtered',
				type: 'array',
				mandatory: true
			},
			{
				key: 'comparison',
				desc: 'The comparison object',
				type: 'object',
				mandatory: true
			},
			{
				key: 'recordVarName',
				desc: 'The variable name given to each entry at each iteration. Defaults to "record"',
				type: 'string'
			},
			{
				key: 'rowNumVarName',
				desc: 'The variable name given to each entry\'s index at each iteration. Defaults to "rowNum"',
				type: 'string'
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the filtered array in',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the filtered array to',
				type: 'string'
			}
		]
	},
	{
		key: 'parseJson',
		desc: 'Parses a JSON string into a JavaScript value',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The string value to parse as JSON',
				type: 'string',
				mandatory: true
			},
			{
				key: 'errorResult',
				desc: 'The value to return if the JSON string could not be parsed',
				type: ['string', 'integer', 'boolean', 'array', 'object']
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the result to',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the resulting value to',
				type: 'string'
			}
		]
	},
	{
		key: 'uploadFileDevCore',
		desc: 'Uploads a file to the DevCore service',
		type: 'string',
		keys: [
			{
				key: 'url',
				desc: 'The endpoint url to upload the file to',
				type: 'string',
				mandatory: true
			},
			{
				key: 'token',
				desc: 'The token for the service',
				type: 'string',
				mandatory: true
			},
			{
				key: 'file',
				desc: 'The file to be uploaded',
				type: 'string',
				mandatory: true
			},
			{
				key: 'ent',
				desc: 'The entity code',
				type: 'string',
				mandatory: true
			},
			{
				key: 'atr',
				desc: 'The attribute code',
				type: 'string',
				mandatory: true
			},
			{
				key: 'lng',
				desc: 'The language code',
				type: 'string',
				mandatory: true
			},
			{
				key: 'fileType',
				desc: 'The type of the file',
				type: 'string',
				mandatory: true
			}
		]
	},
	{
		key: 'downloadFileDevCore',
		desc: 'Downloads a file from the DevCore service',
		type: 'string',
		keys: [
			{
				key: 'url',
				desc: 'The endpoint url to download the file from',
				type: 'string',
				mandatory: true
			},
			{
				key: 'token',
				desc: 'The token for the service',
				type: 'string'
			},
			{
				key: 'fileGuid',
				desc: 'The unique file id to be downloaded',
				type: 'string',
				mandatory: true
			}
		]
	},
	{
		key: 'openLinkInTab',
		desc: 'Opens a link in a new browser tab',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The link to be opened. When lookupOptions is supplied, this will be the id of the lookup option',
				type: 'string',
				mandatory: true
			},
			{
				key: 'lookupOptions',
				desc: 'A list of lookup objects. Used in conjunction with value (the lookup object id) to find the url to open',
				type: 'array',
				spec: [
					{
						id: 'field1',
						url: 'www.google.co.uk'
					},
					{
						id: 'field2',
						url: 'www.google.com'
					}
				]
			}
		]
	},
	{
		key: 'createFlow',
		desc: 'Performs a state flow. This can be used for components that aren\'t mounted yet',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The value to set on the component',
				type: ['string', 'integer', 'boolean', 'array', 'object']
			},
			{
				key: 'valueList',
				desc: 'A list of values to flow to various targets (found in toList)',
				type: 'array'
			},
			{
				key: 'from',
				desc: 'The (static or scoped) of the component to flow from',
				type: 'string'
			},
			{
				key: 'fromList',
				desc: 'An array of id\'s to flow from',
				type: 'array'
			},
			{
				key: 'fromKey',
				desc: 'The state key in the "from" component to flow from',
				type: 'string'
			},
			{
				key: 'fromKeyList',
				desc: 'A list of keys to flow from (when used with fromList)',
				type: 'array'
			},
			{
				key: 'fromSubKey',
				desc: 'The state sub key in the "fromKey" key to flow from',
				type: 'string'
			},
			{
				key: 'fromSubKeyList',
				desc: 'An array of subKeys to flow from (when used with fromKeyList)',
				type: 'array'
			},
			{
				key: 'to',
				desc: 'The id (static or scoped) of the component to flow to',
				type: 'string'
			},
			{
				key: 'toList',
				desc: 'An array of id\'s to flow to',
				type: 'array'
			},
			{
				key: 'toTag',
				desc: 'The tag of the components to set the state on',
				type: 'string'
			},
			{
				key: 'toKey',
				desc: 'The state key in the "to" component to flow to',
				type: 'string'
			},
			{
				key: 'toSubKey',
				desc: 'The sub key to set in the "toKey" object',
				type: 'string'
			},
			{
				key: 'toKeyList',
				desc: 'An array of keys to flow to (when used with toList)',
				type: 'array'
			},
			{
				key: 'mapFunctionString',
				desc: 'A JavaScript function to be performed on the value, before it is set',
				type: 'string',
				spec: "v => v ? 'auto' : 'smallPadding'"
			},
			{
				key: 'scope',
				desc: 'The script (or action) scope when performing this action',
				type: 'string'
			},
			{
				key: 'mapObject',
				desc: 'Useful when the value to set is an object with morphed values. Values can be morphed with the (()) syntax',
				type: 'string',
				spec: {
					key: 'option',
					value: '((value))'
				}
			}
		]
	},
	{
		key: 'allCpnsHaveStates',
		desc: 'Checks if every component have a certain state',
		type: 'string',
		keys: [
			{
				key: 'operator',
				desc: 'The comparison operator to evaluate against',
				type: 'string',
				mandatory: true,
				options: operators
			},
			{
				key: 'comparisons',
				desc: 'A list of comparisons to be evaluated. Used in conjunction with "all", "some" or "none" operators',
				type: 'array',
				mandatory: true
			},
			{
				key: 'branch',
				desc: 'The chain of actions that will be executed when a condition is met',
				type: 'object',
				mandatory: true
			},
			{
				key: 'sourceTag',
				desc: 'The tag of the components to check states on',
				type: 'string'
			},
			{
				key: 'sourceList',
				desc: 'A list of component ids (static or scoped) to check states for',
				type: 'array'
			}
		]
	},
	{
		key: 'concatArray',
		desc: 'Joins arrays together',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The first array to join',
				type: 'array',
				mandatory: true
			},
			{
				key: 'concatValue',
				desc: 'The second array to join',
				type: 'array',
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the result to',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the resulting value to',
				type: 'string'
			}
		]
	},
	{
		key: 'defineFunction',
		desc: 'Defines a function to be used',
		type: 'string',
		keys: [
			{
				key: 'name',
				desc: 'The function\'s name',
				type: 'string',
				mandatory: true
			},
			{
				key: 'acceptArgs',
				desc: 'Arguments the function should accept',
				type: 'object'
			},
			{
				key: 'fn',
				desc: 'The function in string form',
				type: 'string'
			}
		]
	},
	{
		key: 'doesComponentOverflow',
		desc: 'Checks if a component is overflowing',
		type: 'string',
		keys: [
			{
				key: 'target',
				desc: 'The id of the component to check for overflow on. Defaults to ownerId',
				type: 'string',
				mandatory: true
			},
			{
				key: 'axisX',
				desc: 'When true, the result will be whether the component overflows on the X axis',
				type: 'boolean'
			},
			{
				key: 'axisY',
				desc: 'When true, the result will be whether the component overflows on the Y axis',
				type: 'boolean'
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the result to',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the resulting value to',
				type: 'string'
			}
		]
	},
	{
		key: 'evalUnsafeJs',
		desc: 'Evaluates JavaScript using eval',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The string containing the JavaScript to be executed',
				type: 'string',
				mandatory: true
			}
		]
	},
	{
		key: 'generateRandomInteger',
		desc: 'Generates a random integer between a min and max',
		type: 'string',
		keys: [
			{
				key: 'min',
				desc: 'The minimum value which can be generated',
				type: 'integer'
			},
			{
				key: 'max',
				desc: 'The maximum value which can be generated',
				type: 'integer'
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the result to',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the resulting value to',
				type: 'string'
			}
		]
	},
	{
		key: 'getData',
		desc: 'Retrieves data from one of the following data sources: (static, test, hosted, gateway, packaged)',
		type: 'string',
		keys: [
			{
				key: 'id',
				desc: 'The id (static or scoped) of the component to set the fetched data to',
				type: 'string'
			},
			{
				key: 'dtaObj',
				desc: 'The data object name to fetch',
				type: 'string',
				mandatory: true
			},
			{
				key: 'filters',
				desc: 'A list of filters to build a whr clause when querying data from gateway',
				type: 'array',
				mandatory: true
			},
			{
				key: 'offset',
				desc: 'An offset to pass to the gateway when fetching records',
				type: 'integer'
			},
			{
				key: 'pageSize',
				desc: 'An limit to pass to the gateway when fetching records',
				type: 'integer'
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the result to',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the resulting value to',
				type: 'string'
			}
		]
	},
	{
		key: 'getFileDataUrl',
		desc: 'Retrieves a file\'s Data URL from a file component',
		type: 'string',
		keys: [
			{
				key: 'target',
				desc: 'The file component to read the file\'s Data URL from. Defaults to ownerId',
				type: 'string',
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the result to',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the resulting value to',
				type: 'string'
			}
		]
	},
	{
		key: 'loadExternalJs',
		desc: 'Embeds an external script into the application',
		type: 'string',
		keys: [
			{
				key: 'src',
				desc: 'The location of the script to be embedded',
				type: 'string',
				mandatory: true
			},
			{
				key: 'attributes',
				desc: 'An object containing extra attributes to be set on the script tag',
				type: 'object'
			}
		]
	},
	{
		key: 'openUrl',
		desc: 'Opens a new tab with the provided url',
		type: 'string',
		keys: [
			{
				key: 'url',
				desc: 'The url to open',
				type: 'string',
				mandatory: true
			}
		]
	},
	{
		key: 'queryUrl',
		desc: 'Queries data from a given endpoint url',
		type: 'string',
		keys: [
			{
				key: 'method',
				desc: 'The request type e.g. post, get etc',
				type: 'string',
				mandatory: true
			},
			{
				key: 'url',
				desc: 'The url endpoint to query',
				type: 'string',
				mandatory: true
			},
			{
				key: 'body',
				desc: 'The request body to be sent in the request',
				type: 'object',
				mandatory: true
			},
			{
				key: 'headers',
				desc: 'The request headers to be sent in the request',
				type: 'object',
				mandatory: true
			},
			{
				key: 'cache',
				desc: 'Caches the response so it can be reused in subsequent requests',
				type: 'boolean'
			},
			{
				key: 'crossDomain',
				desc: 'When true, the request can be sent across multiple domains',
				type: 'boolean'
			},
			{
				key: 'extractResults',
				desc: 'A list of extraction records specifying which values in the resulting dataset to save into variables',
				type: 'array',
				spec: [
					{
						path: 'response.success',
						variable: 'successful'
					},
					{
						path: 'response.result.0.serviceresult.response.records',
						variable: 'data'
					}
				]
			},
			{
				key: 'extractErrors',
				desc: 'A list of extraction records specifying which values in the resulting dataset to save into variables. Note this can only be used where requests failed',
				type: 'array'
			},
			{
				key: 'extractAny',
				desc: 'A list of extraction records specifying which values in the resulting dataset to save into variables',
				type: 'array'
			}
		]
	},
	{
		key: 'resolveScopedId',
		desc: 'Get the id’s of all components that match a certain scoped id',
		type: 'string',
		keys: [
			{
				key: 'anchorId',
				desc: 'The id of the component that should act as the scoped id lookup anchor point. Defaults to ownerId',
				type: 'string'
			},
			{
				key: 'scopedId',
				desc: 'The scoped id to resolve',
				type: 'string',
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the result to',
				type: 'string'
			}
		]
	},
	{
		key: 'scrollToComponent',
		desc: 'Programmatically scrolls to a target component within a scrollable container',
		type: 'string',
		keys: [
			{
				key: 'target',
				desc: 'The id of the component you wish to scroll into view',
				type: 'string',
				mandatory: true
			},
			{
				key: 'smooth',
				desc: 'When true, the container will have a smooth scroll animation. When set to false the scroll will be instant',
				type: 'boolean'
			},
			{
				key: 'alignVertical',
				desc: 'Defines the vertical alignment of the target position. Defaults to "nearest"',
				type: 'string'
			},
			{
				key: 'alignHorizontal',
				desc: 'Defines the horizontal alignment of the target position. Defaults to "nearest"',
				type: 'string'
			}
		]
	},
	{
		key: 'setPageFavicon',
		desc: 'Sets the HTML document\'s favicon',
		type: 'string',
		keys: [
			{
				key: 'path',
				desc: 'The new favicon\'s href',
				type: 'string',
				mandatory: true
			}
		]
	},
	{
		key: 'setPageTitle',
		desc: 'Sets the HTML document\'s title',
		type: 'string',
		keys: [
			{
				key: 'title',
				desc: 'The new HTML document\'s href',
				type: 'string',
				mandatory: true
			}
		]
	},
	{
		key: 'toggleLayoutDebug',
		desc: 'Adds a border around each component for debugging purposes',
		type: 'string',
		keys: [
			{
				key: 'on',
				desc: 'When set, the on property specifies whether debug mode should be on or off. When not set, debug mode will just be toggled to the opposite state of what it is currently on',
				type: 'boolean'
			}
		]
	},
	{
		key: 'morphEntries',
		desc: 'Returns an array of key value pairs for the supplied object. E.g. [["key1", "value1"], ["key2", "value2"], ...]',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The object value to get the entries from',
				type: 'object',
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the result to',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the resulting value to',
				type: 'string'
			}
		]
	},
	{
		key: 'morphKeys',
		desc: 'Returns an array of the supplied object\'s property keys',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The object value to get the keys from',
				type: 'object',
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the result to',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the resulting value to',
				type: 'string'
			}
		]
	},
	{
		key: 'morphValues',
		desc: 'Returns an array of all the values inside an object',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The object to retrieve the values from',
				type: 'object',
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the result to',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the resulting value to',
				type: 'string'
			}
		]
	},
	{
		key: 'morphFromEntries',
		desc: 'Transforms a list of key-value pairs into an object',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The array containing a list of objects',
				type: ['string', 'array'],
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the result to',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the resulting value to',
				type: 'string'
			}
		]
	},
	{
		key: 'morphTypeOf',
		desc: 'Returns the type of the value',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The value to find the type of',
				type: 'object',
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the result to',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the resulting value to',
				type: 'string'
			}
		]
	},
	{
		key: 'morphKeyPath',
		desc: 'Returns the value inside an object given a supplied path',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The object to retrieve the value from e.g: { a: { b: { c: 10 } } }',
				type: 'object',
				mandatory: true
			},
			{
				key: 'path',
				desc: 'The path to the value e.g: "a.b.c"',
				type: 'string',
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the result to',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the resulting value to',
				type: 'string'
			}
		]
	},
	{
		key: 'generateGuid',
		desc: 'Generates a random guid',
		type: 'string',
		keys: [
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the result to',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the resulting value to',
				type: 'string'
			}
		]
	},
	{
		key: 'updateTheme',
		desc: 'Updates a theme with the supplied key and value',
		type: 'string',
		keys: [
			{
				key: 'theme',
				desc: 'The theme to be updated name',
				type: 'string',
				mandatory: true
			},
			{
				key: 'key',
				desc: 'The theme key update',
				type: 'string'
			},
			{
				key: 'value',
				desc: 'The new value to set',
				type: 'string'
			}
		]
	},
	{
		key: 'getTheme',
		desc: 'Retrieves a theme',
		type: 'string',
		keys: [
			{
				key: 'name',
				desc: 'The theme to be retrieved',
				type: 'string',
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the result to',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the resulting value to',
				type: 'string'
			}
		]
	},
	{
		key: 'resetTheme',
		desc: 'Resets a theme back to its default',
		type: 'string',
		keys: [
			{
				key: 'theme',
				desc: 'The list of themes names to reset',
				type: 'array',
				mandatory: true
			}
		]
	},
	{
		key: 'persistStates',
		desc: 'Persists a state into localStorage, to be loaded later',
		type: 'string',
		keys: [
			{
				key: 'config',
				desc: 'An array of states to be persisted',
				type: 'array',
				mandatory: true,
				spec: [
					{
						id: 'a1',
						key: 'person (defaults to "value")',
						subKey: 'name',
						scope: 'session (defaults to "session")'
					}
				]
			}
		]
	},
	{
		key: 'loadPersistedStates',
		desc: 'Loads persisted states from localStorage',
		type: 'string',
		keys: [
			{
				key: 'config',
				desc: 'An array of ids that should have their persisted states (of all scopes) loaded',
				type: 'array',
				mandatory: true
			}
		]
	},
	{
		key: 'clearPersistedStates',
		desc: 'Removes states previously set in localStorage',
		type: 'string',
		keys: [
			{
				key: 'config',
				desc: 'An array of ids that should have their persisted states cleared',
				type: 'array',
				mandatory: true
			}
		]
	},
	{
		key: 'getPropSpec',
		desc: 'Gets the propSpec of an Opus component',
		type: 'string',
		keys: [
			{
				key: 'cpnType',
				desc: 'The Opus component name to fetch the propSpec for',
				type: 'string',
				mandatory: true
			}
		]
	},
	{
		key: 'clearActionCache',
		desc: 'Clears queryUrl responses that are used when queryUrl is performed with cache: true',
		type: 'string',
		keys: []
	},
	{
		key: 'branch',
		desc: 'Executes a chain of actions concurrently',
		type: 'string',
		keys: [
			{
				key: 'branches',
				desc: 'A list of scripts to be executed concurrently',
				type: 'array'
			},
			{
				key: 'rowNumberVarName',
				desc: 'The variable name given to each branch index. Defaults to "rowNumber"',
				type: 'string'
			}
		]
	},
	{
		key: 'buildPathFindingMap',
		desc: 'Builds a path finding map',
		type: 'string',
		keys: [
			{
				key: 'rects',
				desc: '???',
				type: 'array'
			},
			{
				key: 'w',
				desc: '???',
				type: 'integer'
			},
			{
				key: 'h',
				desc: '???',
				type: 'integer'
			},
			{
				key: 'storeAsName',
				desc: '???',
				type: 'string'
			},
			{
				key: 'padding',
				desc: 'Defaults to 10',
				type: 'integer'
			},
			{
				key: 'zoom',
				desc: 'Defaults to 10',
				type: 'integer'
			}
		]
	},
	{
		key: 'deleteKeys',
		desc: 'Deletes keys from objects or arrays',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The object or array to remove the keys from',
				type: ['array', 'object', 'string']
			},
			{
				key: 'paths',
				desc: 'A list of paths to remove the keys at',
				type: 'array'
			}
		],
		spec: {
			type: 'deleteKeys',
			paths: [
				'a.name',
				'b.0.id'
			],
			value: '{{variable.test}}'
		}
	},
	{
		key: 'forceDirectGraph',
		desc: '',
		type: 'string',
		keys: []
	},
	{
		key: 'getRecordAttachments',
		desc: 'Gets all record attachments from the Mayan document manager',
		type: 'string',
		keys: [
			{
				key: 'target',
				desc: 'The id (static or scoped) of the component to get associated document',
				type: 'string'
			}
		]
	},
	{
		key: 'deleteRecordAttachment',
		desc: 'Deletes a record attachment from the Mayan document manager',
		type: 'string',
		keys: [
			{
				key: 'target',
				desc: 'The id (static or scoped) of the component to get associated document',
				type: 'string'
			}
		]
	},
	{
		key: 'downloadRecordAttachment',
		desc: 'Downloads a record attachment from the Mayan document manager',
		type: 'string',
		keys: [
			{
				key: 'target',
				desc: 'The id (static or scoped) of the component to get associated document',
				type: 'string'
			}
		]
	},
	{
		key: 'updateRecordAttachment',
		desc: 'Updates a record attachment in the Mayan document manager',
		type: 'string',
		keys: [
			{
				key: 'target',
				desc: 'The id (static or scoped) of the component to get associated document',
				type: 'string'
			}
		]
	},
	{
		key: 'uploadRecordAttachment',
		desc: 'Uploads a record attachment to the Mayan document manager',
		type: 'string',
		keys: [
			{
				key: 'target',
				desc: 'The id (static or scoped) of the component to get associated document',
				type: 'string'
			},
			{
				key: 'fileInputId',
				desc: 'The id (static or scoped) of the file input containing',
				type: 'string'
			},
			{
				key: 'fileInputIndex',
				desc: 'The index of the file input',
				type: 'string'
			}
		]
	},
	{
		key: 'getClosestParentOfType',
		desc: 'Gets the closest component with a supplied type',
		type: 'string',
		keys: [
			{
				key: 'target',
				desc: 'The id (static or scoped) of the component to start searching from',
				type: 'string',
				mandatory: true
			},
			{
				key: 'componentType',
				desc: 'The component type to find',
				type: 'string'
			},
			{
				key: 'notComponentType',
				desc: 'The component type to avoid',
				type: 'string'
			}
		]
	},
	{
		key: 'getComponentAtPosition',
		desc: 'Gets a component at a given X and Y position in the HTML document',
		type: 'string',
		keys: [
			{
				key: 'x',
				desc: 'The X coordinate',
				type: 'number',
				mandatory: true
			},
			{
				key: 'y',
				desc: 'The Y coordinate',
				type: 'number',
				mandatory: true
			}
		]
	},
	{
		key: 'getComponentsOfType',
		desc: 'Gets all components that match a type',
		type: 'string',
		keys: [
			{
				key: 'componentType',
				desc: 'The component type to find',
				type: 'string'
			}
		]
	},
	{
		key: 'getDomTree',
		desc: 'Returns a nested data structure that represents the entire dom',
		type: 'string',
		keys: [
			{
				key: 'rootId',
				desc: 'The id of the root node where the tree should start building from',
				type: 'string'
			},
			{
				key: 'includesTypes',
				desc: 'Whether the returned object should include component types. Defaults to false',
				type: 'boolean'
			},
			{
				key: 'generateRandomGuids',
				desc: 'When true, random guids will be generated for each returned node, Defaults to false',
				type: 'boolean'
			}
		]
	},
	{
		key: 'getFlows',
		desc: 'Returns an array of all flows that target a given component',
		type: 'string',
		keys: [
			{
				key: 'target',
				desc: 'The id (static or scoped) of the component to get the flows for. Defaults to ownerId',
				type: 'string'
			},
			{
				key: 'includeFrom',
				desc: 'When true, the result will include flows coming from the target component',
				type: 'boolean'
			},
			{
				key: 'includeTo',
				desc: 'When true, the result will include flows listening to the target component',
				type: 'boolean'
			}
		]
	},
	{
		key: 'getPath',
		desc: 'Gets a pathFindingMap path',
		type: 'string',
		keys: [
			{
				key: 'mapName',
				desc: 'The name of the planner map',
				type: 'string',
				mandatory: true
			},
			{
				key: 'from',
				desc: 'An object containing the X and Y coordinates to search from',
				type: 'object',
				mandatory: true
			},
			{
				key: 'from',
				desc: 'An object containing the X and Y coordinates to search from',
				type: 'object',
				mandatory: true
			}
		]
	},
	{
		key: 'registerStylesheet',
		desc: 'Registers a custom css stylesheet. Returns a stylesheet id',
		type: 'string',
		keys: [
			{
				key: 'stylesheet',
				desc: 'An object containing the X and Y coordinates to search from',
				type: 'object',
				mandatory: true,
				spec: {
					'.fancyDisabled': {
						opacity: '0.5 !important',
						filter: 'hue-rotate(100deg)'
					}
				}
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the stylesheet id to',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the stylesheet id value to',
				type: 'string'
			}
		]
	},
	{
		key: 'removeStylesheet',
		desc: 'Removes a stylesheet from the document',
		type: 'string',
		keys: [
			{
				key: 'target',
				desc: 'The id of the styleSheet to remove from the document',
				type: 'string'
			},
			{
				key: 'targetSelector',
				desc: 'A single query selector of the styleSheet to remove from the document',
				type: 'string'
			},
			{
				key: 'targetSelector',
				desc: 'The query selector of the styleSheet to remove from the document',
				type: 'string'
			}
		]
	},
	{
		key: 'addClass',
		desc: 'Adds a class to the supplied target component',
		type: 'string',
		keys: [
			{
				key: 'target',
				desc: 'The target component id. Defaults to ownerId',
				type: 'string'
			},
			{
				key: 'className',
				desc: 'The classname to add to the target component',
				type: 'string'
			}
		]
	},
	{
		key: 'toggleClass',
		desc: 'Toggles a class on supplied target component',
		type: 'string',
		keys: [
			{
				key: 'target',
				desc: 'The target component id. Defaults to ownerId',
				type: 'string'
			},
			{
				key: 'className',
				desc: 'The classname to toggle on the target component',
				type: 'string'
			}
		]
	},
	{
		key: 'removeClass',
		desc: 'Removes class from the target component',
		type: 'string',
		keys: [
			{
				key: 'target',
				desc: 'The id (static or scoped) of the component to remove the class from. Defaults to ownerId',
				type: 'string'
			},
			{
				key: 'className',
				desc: 'The className to remove from the target component',
				type: 'string',
				mandatory: true
			}
		]
	},
	{
		key: 'replaceInString',
		desc: 'Replaces parts of a string using a replacements list',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The string to replace parts within',
				type: 'string',
				mandatory: true
			},
			{
				key: 'replacements',
				desc: 'A list of objects defining which parts should be changed and to what values they should change to',
				type: 'object',
				mandatory: true,
				spec: [
					{
						fromString: 'This is',
						toString: 'This is not'
					},
					{
						fromString: 'a test string',
						toString: 'a string'
					}
				]
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the result to',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the resulting string value to',
				type: 'string'
			}
		]
	},
	{
		key: 'validate',
		desc: 'Validates a value against Opus validators',
		type: 'string',
		keys: [
			{
				key: 'target',
				desc: 'The id (static or scoped) of the component to fetch the value (to be validated) from',
				type: 'string'
			},
			{
				key: 'showNotifications',
				desc: 'When true, notifications containing validation errors will be displayed',
				type: 'string'
			}
		]
	},
	{
		key: 'morphObject',
		desc: 'Deep clones an object',
		type: 'string',
		keys: [
			{
				key: 'value',
				desc: 'The value to clone',
				type: ['string', 'array', 'object'],
				mandatory: true
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the result to',
				type: 'string'
			},
			{
				key: 'pushToVariable',
				desc: 'The name of an array variable to push the resulting value to',
				type: 'string'
			}
		]
	},
	{
		key: 'getNextComponentId',
		desc: 'Gets a component id',
		type: 'string',
		keys: [
			{
				key: 'startAtId',
				desc: 'The component id (static or scoped) to start the search from',
				type: 'string'
			},
			{
				key: 'allowCircular',
				desc: 'Allows circular references',
				type: 'boolean'
			},
			{
				key: 'parentId',
				desc: 'The parent id (static or scoped) to search up the chain',
				type: 'string'
			},
			{
				key: 'match',
				desc: 'A comparison object to match the next component against',
				type: 'object'
			},
			{
				key: 'storeAsVariable',
				desc: 'The name of the variable to store the result to',
				type: 'string'
			}
		]
	}
];

export default actions;
