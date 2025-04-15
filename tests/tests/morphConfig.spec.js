/* eslint-disable max-lines-per-function, max-lines */

//System
import { test, expect } from '@playwright/test';
import morphConfig from '../../src/components/scriptRunner/helpers/morphConfig';

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
	const res = morphConfig(
		config,
		...buildMocks({
			id: scriptId,
			ownerId,
			states,
			variables
		})
	);

	return res;
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

test('Evaluation', async () => {
	//Test basic evaluation
	expect(
		runMorphConfig({
			id: 's1',
			config: { text: '{{eval.5 + 10}}' },
			states: {},
			variables: {}
		}).text
	).toBe(15);

	//Multiple statement eval
	expect(
		runMorphConfig({
			id: 's1',
			config: { text: '{{eval.const res = "success"; res; }}' }
		}).text
	).toBe('success');

	//Eval with stringified states and variables
	expect(
		runMorphConfig({
			id: 's1',
			config: { text: '{{eval."((state.target.state1))-((variable.var1))" }}' },
			states: { target: { state1: 'success state' } },
			variables: { var1: 'success variable' }
		}).text
	).toBe('success state-success variable');

	//Eval with injected states and variables
	expect(
		runMorphConfig({
			id: 's1',
			config: {
				text: [
					'{{eval.',
					'  const state = {{state.target.nested}};',
					'  const variable = {{variable.nested}};',
					'  const res = `${state.subKey}-${variable.subKey}`;',
					'  res;',
					'}}'
				].join('')
			},
			states: { target: { nested: { subKey: 'success state' } } },
			variables: { nested: { subKey: 'success variable' } }
		}).text
	).toBe('success state-success variable');
});

test('Spread Operator', async () => {
	expect(
		runMorphConfig({
			id: 's1',
			config: { 'spread-': '{{state.target.nested}}' },
			states: { target: { nested: { subKeyA: 'success state' } } }
		}).subKeyA
	).toBe('success state');

	expect(
		runMorphConfig({
			id: 's1',
			config: { '^nested': { 'spread-': '{{s1.variable.nested}}' } },
			variables: { nested: { subKeyB: 'success variable' } }
		}).nested.subKeyB
	).toBe('success variable');
});
