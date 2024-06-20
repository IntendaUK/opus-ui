import { expect, describe, it } from 'vitest';

import { setupDashboard, awaitEl } from '../helpers/setup';
import userEvent from '@testing-library/user-event';

import { waitFor } from '@testing-library/react';

describe('Flows', () => {
	it('Tests that the onMount trigger fires once and only once', async () => {
		const { container } = await setupDashboard({
			"type": "containerSimple",
			"wgts": [
				{
					"id": "field1",
					"type": "input",
					"prps": {
						"value": "Original mounted value",
						"scps": [
							{
								"triggers": [
									{
										"event": "onMount",
										"source": "field1"
									}
								],
								"actions": [
									{
										"type": "setState",
										"target": "field1",
										"key": "value",
										"value": "((state.field1.value)) with a suffix"
									}
								]
							}
						]
					}
				}
			]
		});

		const field = await awaitEl(container, '#field1 .input');

		await waitFor(() => expect(['Original mounted value', 'Original mounted value with a suffix']).toContain(field.value));
		await waitFor(() => expect(field.value).toEqual('Original mounted value with a suffix'));

		userEvent.type(field, ' abc');

		await waitFor(() => expect(field.value).toEqual('Original mounted value with a suffix abc'));
	});
});
