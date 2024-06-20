import { expect, describe, it } from 'vitest';

import { setupDashboard, awaitEl, awaitElCountEquals, getElText } from '../helpers/setup';
import userEvent from '@testing-library/user-event';

import { waitFor } from '@testing-library/react';

describe('Scripts', () => {
	it('setState', async () => {
		const { container } = await setupDashboard({
			type: 'containerSimple',
			wgts: [{
				"id": "f1",
				"type": "input",
				"prps": {
					"value": "initialValue",
					"scps": [
						{
							"triggers": [
								{
									"event": "onMount"
								}
							],
							"actions": [
								{
									"type": "setState",
									"key": "value",
									"value": "changedValue"
								}
							]
						}
					]
				}
			}]
		});

		const el = await awaitEl(container, '#f1 input');

		await waitFor(() => expect(el.value).toEqual('changedValue'));
	});

	it('setState with subkey', async () => {
		const { container } = await setupDashboard({
			type: 'containerSimple',
			wgts: [{
				"id": "f2",
				"type": "input",
				"prps": {
					"value": "initialValue",
					"displayObject": {
						"value": "initialValue"
					},
					"flows": [
						{
							"fromKey": "displayObject",
							"fromSubKey": "value"
						}	
					],
					"scps": [
						{
							"triggers": [
								{
									"event": "onMount"
								}
							],
							"actions": [
								{
									"type": "setState",
									"key": "subKeys",
									"value": [
										{
											"key": "displayObject",
											"subKey": "value",
											"value": "changedValue"
										}
									]
								}
							]
						}
					]
				}
			}]
		});

		const el = await awaitEl(container, '#f2 input');

		await waitFor(() => expect(el.value).toEqual('changedValue'));
	});

	it('setState with state.id.key', async () => {
		const { container } = await setupDashboard({
			type: 'containerSimple',
			wgts: [{
				"id": "f3",
				"type": "input",
				"prps": {
					"value": "initialValue",
					"cachedValue": "changedValue",
					"scps": [
						{
							"triggers": [
								{
									"event": "onMount"
								}
							],
							"actions": [
								{
									"type": "setState",
									"key": "value",
									"value": "((state.self.cachedValue))"
								}
							]
						}
					]
				}
			}]
		});

		const el = await awaitEl(container, '#f3 input');

		await waitFor(() => expect(el.value).toEqual('changedValue'));
	});

	it('setState with state.id.key.subkey', async () => {
		const { container } = await setupDashboard({
			type: 'containerSimple',
			wgts: [{
				"id": "f4",
				"type": "input",
				"prps": {
					"value": "initialValue",
					"cachedValue": {
						"value": "changedValue"
					},
					"scps": [
						{
							"triggers": [
								{
									"event": "onMount"
								}
							],
							"actions": [
								{
									"type": "setState",
									"key": "value",
									"value": "((state.self.cachedValue.value))"
								}
							]
						}
					]
				}
			}]
		});

		const el = await awaitEl(container, '#f4 input');

		await waitFor(() => expect(el.value).toEqual('changedValue'));
	});

	it('setState with variable.name', async () => {
		const { container } = await setupDashboard({
			type: 'containerSimple',
			wgts: [{
				"id": "f5",
				"type": "input",
				"prps": {
					"value": "initialValue",
					"scps": [
						{
							"triggers": [
								{
									"event": "onMount"
								}
							],
							"actions": [
								{
									"type": "setVariable",
									"name": "newValue",
									"value": "changedValue"
								},
								{
									"type": "setState",
									"key": "value",
									"value": "((variable.newValue))"
								}
							]
						}
					]
				}
			}]
		});

		const el = await awaitEl(container, '#f5 input');

		await waitFor(() => expect(el.value).toEqual('changedValue'));
	});

	it('setState with variable.name.subkey', async () => {
		const { container } = await setupDashboard({
			type: 'containerSimple',
			wgts: [{
				"id": "f6",
				"type": "input",
				"prps": {
					"value": "initialValue",
					"scps": [
						{
							"triggers": [
								{
									"event": "onMount"
								}
							],
							"actions": [
								{
									"type": "setVariable",
									"name": "newValue",
									"value": {
										"value": "changedValue"
									}
								},
								{
									"type": "setState",
									"key": "value",
									"value": "((variable.newValue.value))"
								}
							]
						}
					]
				}
			}]
		});

		const el = await awaitEl(container, '#f6 input');

		await waitFor(() => expect(el.value).toEqual('changedValue'));
	});

	it('setState with drilly and state.id.key', async () => {
		const { container } = await setupDashboard({
			type: 'containerSimple',
			wgts: [{
				"id": "f7",
				"type": "input",
				"prps": {
					"value": "initialValue",
					"cachedValue": "changedValue",
					"displayObject": {
						"value": "initialValue"
					},
					"flows": [
						{
							"fromKey": "displayObject",
							"fromSubKey": "value"
						}	
					],
					"scps": [
						{
							"id": "s7",
							"triggers": [
								{
									"event": "onMount"
								}
							],
							"actions": [
								{
									"type": "setState",
									"key": "displayObject",
									"value": {
										"value": "((s7.state.self.cachedValue))"
									}
								}
							]
						}
					]
				}
			}]
		});

		const el = await awaitEl(container, '#f7 input');

		await waitFor(() => expect(el.value).toEqual('changedValue'));
	});

	it('setState with drilly and variable.name', async () => {
		const { container } = await setupDashboard({
			type: 'containerSimple',
			wgts: [{
				"id": "f8",
				"type": "input",
				"prps": {
					"value": "initialValue",
					"displayObject": {
						"value": "initialValue"
					},
					"flows": [
						{
							"fromKey": "displayObject",
							"fromSubKey": "value"
						}	
					],
					"scps": [
						{
							"id": "s8",
							"triggers": [
								{
									"event": "onMount"
								}
							],
							"actions": [
								{
									"type": "setVariable",
									"name": "newValue",
									"value": "changedValue"
								},
								{
									"type": "setState",
									"key": "displayObject",
									"value": {
										"value": "((s8.variable.newValue))"
									}
								}
							]
						}
					]
				}
			}]
		});

		const el = await awaitEl(container, '#f8 input');

		await waitFor(() => expect(el.value).toEqual('changedValue'));
	});

	it('setState with correct scriptId', async () => {
		const { container } = await setupDashboard({
			type: 'containerSimple',
			wgts: [{
				"id": "f9",
				"type": "input",
				"prps": {
					"value": "initialValue",
					"newValue": "changedValue",
					"scps": [
						{
							"id": "s1",
							"triggers": [
								{
									"event": "onMount"
								}
							],
							"actions": [
								{
									"type": "setState",
									"key": "value",
									"value": "((s1.state.self.newValue))"
								}
							]
						}
					]
				}
			}]
		});

		const el = await awaitEl(container, '#f9 input');

		await waitFor(() => expect(el.value).toEqual('changedValue'));
	});

	it('setState with incorrect scriptId', async () => {
		const { container } = await setupDashboard({
			type: 'containerSimple',
			wgts: [{
				"id": "f10",
				"type": "input",
				"prps": {
					"value": "initialValue",
					"newValue": "changedValue",
					"scps": [
						{
							"id": "s1",
							"triggers": [
								{
									"event": "onMount"
								}
							],
							"actions": [
								{
									"type": "setState",
									"key": "value",
									"value": "((s2.state.self.newValue))"
								}
							]
						}
					]
				}
			}]
		});

		const el = await awaitEl(container, '#f10 input');

		await waitFor(() => expect(el.value).toEqual('((s2.state.self.newValue))'));
	});
});
