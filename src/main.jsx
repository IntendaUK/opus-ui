// React
import { createRoot } from 'react-dom/client';

// System
import Opus, { Component, loadMdaPackage } from './library';

loadMdaPackage({
	path: 'trait',
	contents: {
		expander: {
			acceptPrps: {
				rowData: 'object'
			},
			type: 'container',
			prps: {
				canClick: true,
				fireScript: {
					actions: [
						{
							type: 'setState',
							target: '||treeview||',
							key: 'tToggleParent',
							value: '$rowData$'
						}
					]
				}
			},
			wgts: [
				{
					type: 'icon',
					prps: {
						value: 'face'
					}
				}
			]
		},
		label: {
			acceptPrps: {
				rowData: 'object'
			},
			type: 'containerSimple',
			prps: {},
			wgts: [
				{
					id: '%rowData.id%label',
					type: 'container',
					prps: {
						canClick: true,
						fireScript: {
							actions: [
								{
									type: 'setState',
									target: '||treeview||',
									key: 'value',
									value: '$rowData$'
								}
							]
						}
					},
					wgts: [
						{
							type: 'label',
							prps: {
								cpt: '%rowData.name%'
							}
						}
					]
				},
				{
					id: '%rowData.id%expander',
					traits: [
						{
							trait: 'trait/expander',
							traitPrps: {
								rowData: '$rowData$'
							}
						}
					]
				}
			]
		}
	}
});

// Setup
const root = createRoot(document.getElementById('root'));

const mda = {
	scope: 'treeview',
	type: 'treeview',
	prps: {
		dtaAtr: 'id',
		disAtr: 'name',
		childAtr: 'children',
		renderExpander: false,
		staticData: [
			{
				id: 'rooty',
				name: 'Tree Root',
				isRoot: true,
				children: [
					{
						id: 'things',
						name: 'Things',
						children: [
							{
								id: 'door',
								name: 'Door'
							},
							{
								id: 'floor',
								name: 'Floor'
							},
							{
								id: 'banana',
								name: 'Banana'
							}
						]
					}
				]
			}
		],
		mdaLabel: {
			traits: [{
				trait: 'trait/label',
				traitPrps: {
					rowData: '{{rowData}}'
				}
			}]
		}
	}
};

root.render(
	<Opus
		startupMda={mda}
	/>
);
