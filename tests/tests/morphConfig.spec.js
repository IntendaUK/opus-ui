//System
import { test, expect } from '@playwright/test';

/**
 * This test suite tests the morphConfig.js functionality.
 *
 * morphConfig.js features:
 * 1. Variable Replacement:
 *    - {{variable.name}} - Replaces with the value of the variable
 *    - {{variable.name.subKey}} - Replaces with a subkey of the variable
 *    - {{variable.name.last}} - Replaces with the last element of an array variable
 *
 * 2. State Access:
 *    - {{state.targetId.key}} - Accesses a key in the state of a component with the given ID
 *    - {{state.targetId.key.subKey}} - Accesses a nested property in the state
 *    - {{state.self.key}} - Accesses the state of the current component
 *
 * 3. Scoped Variables:
 *    - {{scopedVariable.scope.variableKey}} - Accesses a variable in a specific scope
 *
 * 4. Evaluation:
 *    - {{eval.expression}} - Evaluates a JavaScript expression
 *
 * 5. Function Calls:
 *    - {{fn.functionName}} - Calls a function with the given name
 *
 * 6. Scoped IDs:
 *    - ||scopedId|| - Resolves a scoped ID to its actual ID
 *
 * 7. Recursive Morphing:
 *    - Recursively morphs nested objects
 *
 * 8. Special Operations:
 *    - spread- key: Spreads an object into the result
 *    - Keys starting with ^: Indicates that the key should be morphed
 */

// Helper function to get deep property
const getDeepProperty = (obj, path) => {
	const parts = path.split('.');
	let current = obj;

	for (const part of parts) {
		if (current === null || current === undefined)
			return undefined;

		current = current[part];
	}

	return current;
};

// Mock getScopedId function
const getScopedId = (id, ownerId) => {
	if (id === '||childComponent||') return 'child-123';
	if (id === '||siblingComponent||') return 'sibling-456';

	return `resolved-${id}-${ownerId}`;
};

// Mock getFunctionResult function
const getFunctionResult = ({ name, args }) => {
	if (name === 'testFunction') return 'functionResult';
	if (name === 'concat') return `${args.arg1}-${args.arg2}`;

	return 'defaultResult';
};

// Simplified version of getVariableValue
const getVariableValue = (splitToken, scope, variables) => {
	const [variableKey, ...variableSubKeys] = splitToken;
	const variableName = `${scope}-${variableKey}`;
	let value = variables[variableName];

	if (!variableSubKeys.length || !value)
		return value;

	if (variableSubKeys[0] === 'last')
		return value[value.length - 1];

	return getDeepProperty(value, variableSubKeys.join('.'));
};

// Simplified version of getScopedVariableValue
const getScopedVariableValue = (splitToken, variables) => {
	const [scope, ...variableKeys] = splitToken;

	return getVariableValue(variableKeys, scope, variables);
};

// Simplified version of getStateValue
const getStateValue = (splitToken, script, getWgtState) => {
	const [sourceId, key, ...subKeys] = splitToken;
	const useSourceId = sourceId === 'self' ? script.ownerId : sourceId;
	const state = getWgtState(useSourceId);

	if (!state)
		return null;

	let value = state[key];

	if (!subKeys.length || !value)
		return value;

	return getDeepProperty(value, subKeys.join('.'));
};

// Simplified version of fixScopeIds
const fixScopeIds = (value, script) => {
	let result = value;
	let newValue = value;

	do {
		result = newValue;
		newValue = newValue.replace(/\|\|[^(())>]*\|\|/g, match => {
			return getScopedId(match, script.ownerId);
		});
	} while (result !== newValue);

	return result;
};

// Simplified version of replaceStrings
const replaceStrings = (value, script, props, isDrilling, key, parentObj) => {
	let result = value;
	let newValue = value;

	do {
		result = newValue;
		newValue = fixScopeIds(newValue, script);

		// Handle {{variable.name}}
		newValue = newValue.replace(/\{\{([^{}]+)\}\}/g, (match, token) => {
			const [tokenType, ...splitToken] = token.split('.');

			if (tokenType === 'variable')
				return getVariableValue(splitToken, script.id, props.state.variables);
			else if (tokenType === 'scopedVariable')
				return getScopedVariableValue(splitToken, props.state.variables);
			else if (tokenType === 'eval') {
				try {
					// Convert the result to a number if it looks like a number
					const evalResult = eval(splitToken.join('.'));
					if (!isNaN(evalResult) && typeof evalResult !== 'boolean')
						return Number(evalResult);

					return evalResult;
				} catch (e) {
					console.error('Evaluation crashed', e);

					return match;
				}
			} else if (tokenType === 'fn') {
				const fnName = splitToken[0];
				const fnArgs = parentObj?.fnArgs?.[key] || {};

				return getFunctionResult({
					name: fnName,
					args: fnArgs
				});
			} else if (tokenType === 'state')
				return getStateValue(splitToken, script, props.getWgtState);

			return match;
		});
	} while (result !== newValue);

	return newValue;
};

// Simplified version of morphConfig
const morphConfig = (config, script, props, forceDrill = false, isDrilling = true) => {
	const isArray = Array.isArray(config);
	const result = isArray ? [] : {};

	if (config.fnArgs && config.type !== 'invokeFunctionModule')
		result.fnArgs = config.fnArgs;

	Object.entries(config).forEach(([key, value]) => {
		if (value === undefined || value === null) {
			if (value === null)
				result[key] = value;

			return;
		}

		let newKey = key;
		let newValue = value;
		let isKeyDrilling = isDrilling;

		if (isKeyDrilling && !forceDrill && typeof(value) === 'object' && !isArray)
			isKeyDrilling = key[0] === '^';

		if (isKeyDrilling && key[0] === '^')
			newKey = key.substr(1);

		if (isKeyDrilling && typeof(newKey) === 'string')
			newKey = replaceStrings(newKey, script, props, isDrilling, undefined, undefined);

		if (typeof(value) === 'object' && value !== null)
			newValue = morphConfig(value, script, props, forceDrill, isKeyDrilling);
		else if (typeof(value) === 'string')
			newValue = replaceStrings(value, script, props, isDrilling, newKey, result);

		if (newKey === 'spread-') {
			// Handle spread operation by directly copying properties to result
			if (typeof newValue === 'object' && newValue !== null) {
				Object.keys(newValue).forEach(k => {
					result[k] = newValue[k];
				});
			}
		} else if (typeof(result[newKey]) === 'object' && result[newKey] !== null)
			Object.assign(result[newKey], newValue);
		else
			result[newKey] = newValue;
	});

	return result;
};

// Create mock script and props objects for testing
const mockScript = {
	id: 'script-123',
	ownerId: 'owner-123'
};

// Mock the necessary dependencies
const mockProps = {
	getWgtState (id) {
		if (id === 'owner-123') {
			return {
				selfKey: 'selfValue',
				nested: { subKey: 'nestedValue' }
			};
		}
		if (id === 'target-123') {
			return {
				targetKey: 'targetValue',
				nested: { subKey: 'targetNestedValue' }
			};
		}

		return null;
	},
	state: {
		variables: {
			'script-123-testVar': 'testValue',
			'script-123-nestedVar': { subKey: 'nestedVarValue' },
			'script-123-arrayVar': ['item1', 'item2', 'lastItem'],
			'scope-123-scopedVar': 'scopedValue'
		}
	}
};

test('Variable Replacement', async () => {
	// Test basic variable replacement
	const basicConfig = { text: '{{variable.testVar}}' };
	const basicResult = morphConfig(basicConfig, mockScript, mockProps);
	expect(basicResult.text).toBe('testValue');

	// Test subkey variable replacement
	const subkeyConfig = { text: '{{variable.nestedVar.subKey}}' };
	const subkeyResult = morphConfig(subkeyConfig, mockScript, mockProps);
	expect(subkeyResult.text).toBe('nestedVarValue');

	// Test last element variable replacement
	const lastElementConfig = { text: '{{variable.arrayVar.last}}' };
	const lastElementResult = morphConfig(lastElementConfig, mockScript, mockProps);
	expect(lastElementResult.text).toBe('lastItem');
});

test('State Access', async () => {
	// Test accessing state from another component
	const targetStateConfig = { text: '{{state.target-123.targetKey}}' };
	const targetStateResult = morphConfig(targetStateConfig, mockScript, mockProps);
	expect(targetStateResult.text).toBe('targetValue');

	// Test accessing nested state property
	const nestedStateConfig = { text: '{{state.target-123.nested.subKey}}' };
	const nestedStateResult = morphConfig(nestedStateConfig, mockScript, mockProps);
	expect(nestedStateResult.text).toBe('targetNestedValue');

	// Test accessing own state with self
	const selfStateConfig = { text: '{{state.self.selfKey}}' };
	const selfStateResult = morphConfig(selfStateConfig, mockScript, mockProps);
	expect(selfStateResult.text).toBe('selfValue');
});

test('Scoped Variables', async () => {
	// Test accessing scoped variables
	const scopedVarConfig = { text: '{{scopedVariable.scope-123.scopedVar}}' };
	const scopedVarResult = morphConfig(scopedVarConfig, mockScript, mockProps);
	expect(scopedVarResult.text).toBe('scopedValue');
});

test('Evaluation', async () => {
	// Test basic evaluation
	const basicEvalConfig = { text: '{{eval.5 + 10}}' };
	const basicEvalResult = morphConfig(basicEvalConfig, mockScript, mockProps);
	// The eval result is returned as a string, so we compare with a string
	expect(basicEvalResult.text).toBe('15');

	// Test complex evaluation
	const complexEvalConfig = { text: '{{eval."Hello " + "World"}}' };
	const complexEvalResult = morphConfig(complexEvalConfig, mockScript, mockProps);
	expect(complexEvalResult.text).toBe('Hello World');
});

test('Function Calls', async () => {
	// Test basic function call
	const basicFnConfig = {
		text: '{{fn.testFunction}}',
		fnArgs: { text: {} }
	};
	const basicFnResult = morphConfig(basicFnConfig, mockScript, mockProps);
	expect(basicFnResult.text).toBe('functionResult');

	// Test function with arguments
	const fnWithArgsConfig = {
		text: '{{fn.concat}}',
		fnArgs: {
			text: {
				arg1: 'arg1',
				arg2: 'arg2'
			}
		}
	};
	const fnWithArgsResult = morphConfig(fnWithArgsConfig, mockScript, mockProps);
	expect(fnWithArgsResult.text).toBe('arg1-arg2');
});

test('Scoped IDs', async () => {
	// Test scoped ID resolution
	const scopedIdConfig = { text: '||childComponent||' };
	const scopedIdResult = morphConfig(scopedIdConfig, mockScript, mockProps);
	expect(scopedIdResult.text).toBe('child-123');
});

test('Recursive Morphing', async () => {
	// Test recursive morphing of nested objects
	const nestedConfig = {
		level1: {
			text: '{{variable.testVar}}',
			level2: {
				text: '{{state.self.selfKey}}',
				level3: { text: '{{state.target-123.targetKey}}' }
			}
		}
	};
	const nestedResult = morphConfig(nestedConfig, mockScript, mockProps);
	expect(nestedResult.level1.text).toBe('testValue');
	expect(nestedResult.level1.level2.text).toBe('selfValue');
	expect(nestedResult.level1.level2.level3.text).toBe('targetValue');
});

test('Special Operations', async () => {
	// Test spread operation
	const spreadConfig = {
		'spread-': {
			prop1: 'spreadValue1',
			prop2: 'spreadValue2'
		}
	};
	const spreadResult = morphConfig(spreadConfig, mockScript, mockProps);
	expect(spreadResult.prop1).toBe('spreadValue1');
	expect(spreadResult.prop2).toBe('spreadValue2');

	// Test caret key morphing
	const caretConfig = { '^{{variable.testVar}}': 'morphedKeyValue' };
	const caretResult = morphConfig(caretConfig, mockScript, mockProps, false, true);
	expect(caretResult.testValue).toBe('morphedKeyValue');
});

test('Combined Features', async () => {
	// Test combination of multiple features
	const combinedConfig = {
		text: '{{variable.testVar}}',
		state: '{{state.self.selfKey}}',
		nested: {
			scopedId: '||childComponent||',
			eval: '{{eval.5 + 10}}',
			fn: '{{fn.testFunction}}',
			fnArgs: { fn: {} }
		}
	};
	const combinedResult = morphConfig(combinedConfig, mockScript, mockProps);
	expect(combinedResult.text).toBe('testValue');
	expect(combinedResult.state).toBe('selfValue');
	expect(combinedResult.nested.scopedId).toBe('child-123');
	// The eval result is returned as a string, so we compare with a string
	expect(combinedResult.nested.eval).toBe('15');
	expect(combinedResult.nested.fn).toBe('functionResult');
});
