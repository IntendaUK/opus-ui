import { expect, describe, it } from 'vitest';

import { setupDashboard, awaitEl } from '../helpers/setup';

import { waitFor } from '@testing-library/react';

describe('Mount Flows', () => {
	it('Initial flow values are set on components that are still being mounted', async () => {
		const { container } = await setupDashboard({
		    "type": "containerSimple",
		    "prps": {
		        "padding": true,
		        "flows": [
		            {
		                "from": "i1",
		                "fromKey": "value",
		                "to": "i2",
		                "toKey": "value"
		            }
		        ]
		    },
		    "wgts": [
		        {
		            "id": "i1",
		            "type": "input",
		            "prps": {
		                "value": "input 1",
		                "scps": [
		                    {
		                        "triggers": [
		                            {
		                                "event": "onMount",
		                                "source": "i1"
		                            }
		                        ],
		                        "actions": [
		                            {
		                                "type": "setState",
		                                "target": "i3",
		                                "key": "value",
		                                "value": "i1 mounted"
		                            }
		                        ]
		                    }
		                ]
		            }
		        },
		        {
		            "id": "i2",
		            "type": "input",
		            "prps": {
		                "value": "input 2",
		                "scps": [
		                    {
		                        "triggers": [
		                            {
		                                "event": "onMount",
		                                "source": "i2"
		                            }
		                        ],
		                        "actions": [
		                            {
		                                "type": "setState",
		                                "target": "i4",
		                                "key": "value",
		                                "value": "i2 mounted"
		                            }
		                        ]
		                    }
		                ]
		            }
		        }
		    ]
		});

		const i1 = await awaitEl(container, '#i1 input');
		await waitFor(() => expect(i1.value).not.toEqual(''));

		const i2 = await awaitEl(container, '#i2 input');
		await waitFor(() => expect(i1.value).not.toEqual('input 2'));

		expect(i1.value).toEqual(i2.value);
	});

	//This test will fail until we change the scriptRunner setState action to one using flows instead
	it('Mount events are fired for components even when they have flows being set on them while they are being mounted', async () => {
		const { container } = await setupDashboard({
		    "type": "containerSimple",
		    "prps": {
		        "padding": true,
		        "flows": [
		            {
		                "from": "i1",
		                "fromKey": "value",
		                "to": "i2",
		                "toKey": "value"
		            }
		        ]
		    },
		    "wgts": [
		        {
		            "id": "i1",
		            "type": "input",
		            "prps": {
		                "value": "input 1",
		                "scps": [
		                    {
		                        "triggers": [
		                            {
		                                "event": "onMount",
		                                "source": "i1"
		                            }
		                        ],
		                        "actions": [
		                            {
		                                "type": "setState",
		                                "target": "i3",
		                                "key": "value",
		                                "value": "i1 mounted"
		                            }
		                        ]
		                    }
		                ]
		            }
		        },
		        {
		            "id": "i2",
		            "type": "input",
		            "prps": {
		                "value": "input 2",
		                "scps": [
		                    {
		                        "triggers": [
		                            {
		                                "event": "onMount",
		                                "source": "i2"
		                            }
		                        ],
		                        "actions": [
		                            {
		                                "type": "setState",
		                                "target": "i4",
		                                "key": "value",
		                                "value": "i2 mounted"
		                            }
		                        ]
		                    }
		                ]
		            }
		        },
		        {
		            "id": "i3",
		            "type": "input",
		            "prps": {
		                
		            }
		        },
		        {
		            "id": "i4",
		            "type": "input",
		            "prps": {
		                
		            }
		        }
		    ]
		});

		const i3 = await awaitEl(container, '#i3 input');
		await waitFor(() => expect(i3.value).toEqual('i1 mounted'));

		const i4 = await awaitEl(container, '#i4 input');
		await waitFor(() => expect(i4.value).toEqual('i2 mounted'));
	});
});
