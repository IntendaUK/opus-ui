/* eslint-disable max-lines-per-function */

//System
import { test, expect } from '@playwright/test';
import morphConfig from '../../src/components/scriptRunner/helpers/morphConfig';

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

// Mock the necessary dependencies
const buildMocks = ({ id: scriptId, states = {}, variables }) => {
	Object.entries(variables).forEach(([k, v]) => {
		if (k.includes('-'))
			return;

		delete variables[k];

		variables[`${scriptId}-${k}`] = v;
	});

	return [{ id: scriptId }, {
		getWgtState: id => {
			return states[id];
		},
		state: { variables }
	}];
};

const runMorphConfig = ({ id: scriptId = 's1', config, states, variables }) => {
	return morphConfig(
		config,
		...buildMocks({
			id: scriptId,
			states,
			variables
		})
	);
};

// Tests
test('Variable Replacement', async () => {
	//Basic Variables

	// String replacement
	expect(
		runMorphConfig({
			id: 's1',
			config: { text: '((variable.var1))' },
			variables: { var1: 'success' }
		}).text
	).toBe('success');

	// Integer replacement
	expect(
		runMorphConfig({
			id: 's1',
			config: { text: '{{variable.var1}}' },
			variables: { var1: 123 }
		}).text
	).toBe(123);

	// Coerce integer to string
	expect(
		runMorphConfig({
			id: 's1',
			config: { text: '((variable.var1))' },
			variables: { var1: 123 }
		}).text
	).toBe('123');

	//Variable Sub-Keys

	// String replacement
	expect(
		runMorphConfig({
			id: 's1',
			config: { text: '((variable.var1.sub))' },
			variables: { var1: { sub: 'success' } }
		}).text
	).toBe('success');

	// Integer replacement
	expect(
		runMorphConfig({
			id: 's1',
			config: { text: '{{variable.var1.sub}}' },
			variables: { var1: { sub: 123 } }
		}).text
	).toBe(123);

	// Coerce integer to string
	expect(
		runMorphConfig({
			id: 's1',
			config: { text: '((variable.var1.sub))' },
			variables: { var1: { sub: 123 } }
		}).text
	).toBe('123');

	//Multi Stage Variables

	// String replacement
	expect(
		runMorphConfig({
			id: 's1',
			config: { text: '((variable.((variable.var1))))' },
			variables: {
				var1: 'var2',
				var2: 'success'
			}
		}).text
	).toBe('success');

	// Integer replacement
	expect(
		runMorphConfig({
			id: 's1',
			config: { text: '{{variable.((variable.var1))}}' },
			variables: {
				var1: 'var2',
				var2: 123
			}
		}).text
	).toBe(123);

	// Coerce integer to string
	expect(
		runMorphConfig({
			id: 's1',
			config: { text: '((variable.((variable.var1))))' },
			variables: {
				var1: 'var2',
				var2: 123
			}
		}).text
	).toBe('123');

	/*// Test subkey variable replacement
	const subkeyConfig = { text: '{{variable.nestedVar.subKey}}' };
	const subkeyResult = morphConfig(subkeyConfig, mockScript, mockProps);
	expect(subkeyResult.text).toBe('nestedVarValue');

	// Test last element variable replacement
	const lastElementConfig = { text: '{{variable.arrayVar.last}}' };
	const lastElementResult = morphConfig(lastElementConfig, mockScript, mockProps);
	expect(lastElementResult.text).toBe('lastItem');*/
});
/*
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

test('Nested Expressions', async () => {
	// Test nested expressions with inside-out resolution
	// First variable.abc resolves to 'component-abc', then state.component-abc.someKey resolves to 'nestedComponentValue'
	const nestedExprConfig = { text: '((state.((variable.abc)).someKey))' };
	const nestedExprResult = morphConfig(nestedExprConfig, mockScript, mockProps);
	expect(nestedExprResult.text).toBe('nestedComponentValue');

	// Test with multiple levels of nesting
	const mockProps2 = {
		...mockProps,
		state: {
			...mockProps.state,
			variables: {
				...mockProps.state.variables,
				'script-123-componentId': 'abc'
			}
		}
	};

	const multiNestedConfig = { text: '((state.((variable.((variable.componentId)))).someKey))' };
	const multiNestedResult = morphConfig(multiNestedConfig, mockScript, mockProps2);
	expect(multiNestedResult.text).toBe('nestedComponentValue');
});
*/
