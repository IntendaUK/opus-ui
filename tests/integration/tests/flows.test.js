import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { waitFor } from '@testing-library/react';

import { setupDashboard,
	awaitEls,
	awaitElNth,
	awaitElCountEquals } from '../helpers/setup';

const gridWasFiltered = async (container, gridId, incorrectOption, childCount = 1) => {
	const query = `[id="${gridId}"] .cell`;

	await awaitElCountEquals(container, query, childCount);

	return true;
};

describe('Flows', () => {
	it('Test 1.1: Flows "value" from input1 to input2. (with flow defined on input1)', async () => {
		const { container } = await setupDashboard({
			type: 'containerSimple',
			wgts: [
				{
					"id": "a",
					"type": "input",
					"prps": {
						"flows": [
							{
								"from": "a",
								"to": "b"
							}
						],
						"value": "Input 1's value"
					}
				},
				{
					"id": "b",
					"type": "input"
				}
			]
		});

		const els = await awaitEls(container, [
			'#a .input',
			'#b .input'
		]);

		await waitFor(() => expect(els[0].value).toEqual(els[1].value));
	});
});

describe('Flows', () => {
	it('Test 1.2: Same as 1.1. and updates input2\'s "value" when changing input1\'s value', async () => {
		const { container } = await setupDashboard({
			type: 'containerSimple',
			wgts: [
				{
					"id": "a",
					"wgts": [],
					"prps": {
						"flows": [
							{
								"from": "a",
								"to": "b"
							}
						],
						"value": "Input 1's value"
					},
					"type": "input"
				},
				{
					"id": "b",
					"type": "input"
				}
			]
		});

		const els = await awaitEls(container, [
			'#a .input',
			'#b .input'
		]);

		userEvent.type(els[0], 'addedString');

		await waitFor(() => expect(els[1].value).toBe(els[0].value));
	});
});

describe('Flows', () => {
	it('Test 1.3: Flows "value" from input1 to input2 (with flow defined on input2)', async () => {
		const { container } = await setupDashboard({
			type: 'containerSimple',
			wgts: [
				{
					"id": "a",
					"prps": {
						"value": "Input 1's value"
					},
					"type": "input"
				},
				{
					"id": "b",
					"prps": {
						"flows": [
							{
								"from": "a",
								"to": "b"
							}
						]
					},
					"type": "input"
				}
			]
		});

		const els = await awaitEls(container, [
			'#a .input',
			'#b .input'
		]);

		await waitFor(() => expect(els[1].value).toBe(els[0].value));
	});
});

describe('Flows', () => {
	it('Test 1.4: Same as 1.3. and updates input2\'s "value" when changing input1\'s value', async () => {
		const { container } = await setupDashboard({
			type: 'containerSimple',
			wgts: [
				{
					"id": "a",
					"prps": {
						"value": "Input 1's value"
					},
					"type": "input"
				},
				{
					"id": "b",
					"prps": {
						"flows": [
							{
								"from": "a",
								"to": "b"
							}
						],
						"cpt": "Input2"
					},
					"type": "input"
				}
			]
		});

		const els = await awaitEls(container, [
			'#a .input',
			'#b .input'
		]);

		userEvent.type(els[0], 'addedString');

		await waitFor(() => expect(els[1].value).toBe(els[0].value));
	});
});
