/* eslint-disable max-lines-per-function, max-lines */

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
const buildMocks = ({ id: scriptId, ownerId, states = {}, variables = {} }) => {
	Object.entries(variables).forEach(([k, v]) => {
		if (k.includes('-'))
			return;

		delete variables[k];

		variables[`${scriptId}-${k}`] = v;
	});

	return [{
		id: scriptId,
		ownerId
	}, {
		getWgtState: id => {
			return states[id];
		},
		state: { variables }
	}];
};

const runMorphConfig = ({ id: scriptId = 's1', ownerId, config, states, variables }) => {
	return morphConfig(
		config,
		...buildMocks({
			id: scriptId,
			ownerId,
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

	// Test last element variable replacement
	expect(
		runMorphConfig({
			id: 's1',
			config: { text: '{{variable.arrayVar.last}}' },
			variables: { arrayVar: ['firstItem', 'middleItem', 'lastItem'] }
		}).text
	).toBe('lastItem');
});

test('State Access', async () => {
	// Test accessing state from another component
	expect(
		runMorphConfig({
			id: 's1',
			config: { text: '{{state.target.targetKey}}' },
			states: { target: { targetKey: 'targetValue' } }
		}).text
	).toBe('targetValue');

	// Test accessing nested state property
	expect(
		runMorphConfig({
			id: 's1',
			config: { text: '{{state.target.nested.subKey}}' },
			states: { target: { nested: { subKey: 'targetNestedValue' } } }
		}).text
	).toBe('targetNestedValue');

	// Test accessing own state with self
	expect(
		runMorphConfig({
			id: 's1',
			ownerId: 'c1',
			config: { text: '{{state.self.selfKey}}' },
			states: { c1: { selfKey: 'selfValue' } }
		}).text
	).toBe('selfValue');
});

test('Scoped Variables', async () => {
	//Basic
	expect(
		runMorphConfig({
			id: 's1',
			config: { text: '{{scopedVariable.s2.scopedVar}}' },
			variables: { 's2-scopedVar': 'scopedValue' }
		}).text
	).toBe('scopedValue');

	//Don't replace nested if it's not scoped
	expect(
		runMorphConfig({
			id: 's1',
			config: { nested: { subKey: '{{variable.var1}}' } },
			variables: { var1: 'failure' }
		}).nested.subKey
	).toBe('{{variable.var1}}');

	//Replace nested if it has our scope
	expect(
		runMorphConfig({
			id: 's1',
			config: { nested: { subKey: '{{s1.variable.var1}}' } },
			variables: { var1: 'success' }
		}).nested.subKey
	).toBe('success');

	//Don't replace nested if it has the wrong scope
	expect(
		runMorphConfig({
			id: 's1',
			config: { nested: { subKey: '{{s2.variable.var1}}' } },
			variables: { 's2-var1': 'failure' }
		}).nested.subKey
	).toBe('{{s2.variable.var1}}');

	//Replace nested with forced drilling
	expect(
		runMorphConfig({
			id: 's1',
			config: { '^nested': { subKey: '{{variable.var1}}' } },
			variables: { var1: 'success' }
		}).nested.subKey
	).toBe('success');

	expect(
		runMorphConfig({
			id: 's1',
			config: { '^nested': { '^subKey': { deepKey: '{{variable.var1}}' } } },
			variables: { var1: 'success' }
		}).nested.subKey.deepKey
	).toBe('success');
});

/*test('Evaluation', async () => {
	// Test basic evaluation
	expect(
		runMorphConfig({
			id: 's1',
			config: { text: '{{eval.5 + 10}}' },
			states: {},
			variables: {}
		}).text
	).toBe('15');

	// Test complex evaluation
	expect(
		runMorphConfig({
			id: 's1',
			config: { text: '{{eval."Hello " + "World"}}' },
			states: {},
			variables: {}
		}).text
	).toBe('Hello World');
});

test('Function Calls', async () => {
	// Test basic function call
	expect(
		runMorphConfig({
			id: 's1',
			config: {
				text: '{{fn.testFunction}}',
				fnArgs: { text: {} }
			},
			states: {},
			variables: {}
		}).text
	).toBe('functionResult');

	// Test function with arguments
	expect(
		runMorphConfig({
			id: 's1',
			config: {
				text: '{{fn.concat}}',
				fnArgs: {
					text: {
						arg1: 'arg1',
						arg2: 'arg2'
					}
				}
			},
			states: {},
			variables: {}
		}).text
	).toBe('arg1-arg2');
});

test('Scoped IDs', async () => {
	// Test scoped ID resolution
	expect(
		runMorphConfig({
			id: 's1',
			config: { text: '||childComponent||' },
			states: {},
			variables: { childComponent: 'child-123' }
		}).text
	).toBe('child-123');
});

test('Recursive Morphing', async () => {
	// Test recursive morphing of nested objects
	const result = runMorphConfig({
		id: 's1',
		config: {
			level1: {
				text: '{{variable.testVar}}',
				level2: {
					text: '{{state.self.selfKey}}',
					level3: { text: '{{state.target-123.targetKey}}' }
				}
			}
		},
		states: {
			s1: { selfKey: 'selfValue' },
			'target-123': { targetKey: 'targetValue' }
		},
		variables: { testVar: 'testValue' }
	});

	expect(result.level1.text).toBe('testValue');
	expect(result.level1.level2.text).toBe('selfValue');
	expect(result.level1.level2.level3.text).toBe('targetValue');
});

test('Special Operations', async () => {
	// Test spread operation
	const spreadResult = runMorphConfig({
		id: 's1',
		config: {
			'spread-': {
				prop1: 'spreadValue1',
				prop2: 'spreadValue2'
			}
		},
		states: {},
		variables: {}
	});
	expect(spreadResult.prop1).toBe('spreadValue1');
	expect(spreadResult.prop2).toBe('spreadValue2');
});

test('Combined Features', async () => {
	// Test combination of multiple features
	const result = runMorphConfig({
		id: 's1',
		config: {
			text: '{{variable.testVar}}',
			state: '{{state.self.selfKey}}',
			nested: {
				scopedId: '||childComponent||',
				eval: '{{eval.5 + 10}}',
				fn: '{{fn.testFunction}}',
				fnArgs: { fn: {} }
			}
		},
		states: { s1: { selfKey: 'selfValue' } },
		variables: {
			testVar: 'testValue',
			childComponent: 'child-123'
		}
	});

	expect(result.text).toBe('testValue');
	expect(result.state).toBe('selfValue');
	expect(result.nested.scopedId).toBe('child-123');
	// The eval result is returned as a string, so we compare with a string
	expect(result.nested.eval).toBe('15');
	expect(result.nested.fn).toBe('functionResult');
});

test('Nested Expressions', async () => {
	// Test nested expressions with inside-out resolution
	// First variable.abc resolves to 'component-abc', then state.component-abc.someKey resolves to 'nestedComponentValue'
	expect(
		runMorphConfig({
			id: 's1',
			config: { text: '((state.((variable.abc)).someKey))' },
			states: { 'component-abc': { someKey: 'nestedComponentValue' } },
			variables: { abc: 'component-abc' }
		}).text
	).toBe('nestedComponentValue');

	// Test with multiple levels of nesting
	expect(
		runMorphConfig({
			id: 's1',
			config: { text: '((state.((variable.((variable.componentId)))).someKey))' },
			states: { 'component-abc': { someKey: 'nestedComponentValue' } },
			variables: {
				componentId: 'abc',
				abc: 'component-abc'
			}
		}).text
	).toBe('nestedComponentValue');
});
*/
