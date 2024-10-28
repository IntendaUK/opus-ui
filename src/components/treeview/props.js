/* eslint-disable max-len, max-lines, max-lines-per-function */

//External props
import propsSharedDataLoader from '../dataLoader/propsShared';
import propsSharedDataLoaderExternal from '../dataLoader/propsSharedExternal';

const props = {
	rootNodeId: {
		type: 'string',
		desc: 'The root node\'s id. Whilst this is only for internal use, it\'s still important to set it to a unique value',
		dft: ''
	},
	//Data Config
	disAtr: {
		type: 'string',
		desc: 'Defines which key in each record should be displayed as the node\'s caption'
	},
	dtaAtr: {
		type: 'string',
		desc: 'Defines which key in each record should be used as the node\'s data value'
	},
	childAtr: {
		type: 'string',
		desc: 'Defines which key in each record defines a node\'s child nodes'
	},
	patAtr: {
		type: 'string',
		desc: 'This is only used when child data is loaded dynamically. Refer to the tSetChildData property for more info'
	},
	prpsTreeNode: {
		type: 'string',
		desc: 'Props to be passed to each node in the treeview',
		dft: () => ({})
	},
	traitsTreeNode: {
		type: 'string',
		desc: 'Traits to be passed to each node in the treeview',
		dft: () => []
	},
	recordAtr: {
		type: 'string',
		desc: 'When dragging and dropping nodes, the tree expects the \'dragger\' components to have records (the node data) set on them. This record will be stored on each \'dragger\' component in this key. When draggers are dragged in from outside the tree, this record attribute should also be set on them',
		dft: 'record'
	},

	//Other Config
	canDragAndDrop: {
		type: 'boolean',
		desc: 'When true, nodes can be dragged and dropped',
		dft: false
	},
	autoExpand: {
		type: 'boolean',
		desc: 'When true, the root node will automatically expand',
		dft: false
	},
	autoExpandChildNodes: {
		type: 'boolean',
		desc: 'When true, the all child nodes will automatically expand',
		dft: false
	},
	hideRootNode: {
		type: 'boolean',
		desc: 'When true, the root node will be hidden',
		classMap: true,
		dft: false
	},
	noPad: {
		type: 'boolean',
		desc: 'When true, child nodes are not indented and as a result, all nodes are left aligned',
		classMap: 'noPad',
		dft: false
	},
	levelLeftMarginSize: {
		type: 'string',
		desc: 'The distance between each child node level when noPad is false',
		dft: 'smallPadding'
	},
	moveOnDrop: {
		type: 'boolean',
		desc: 'When true, data will be modified internally to reflect drag-and-drop changes',
		dft: false
	},

	//Config
	dragTargets: {
		type: 'array',
		desc: 'Defines where nodes can be dropped when dragAndDrop is set to true',
		spec: ['id1', 'id2', '##tag1##']
	},
	prpsContainerDnd: {
		type: 'object',
		desc: 'Extra properties to be assigned to each node\'s containerDnd',
		dft: () => ({})
	},
	dtaScpsChildNode: {
		type: 'object',
		desc: 'Defines which script(s) should be run to obtain child data'
	},

	//Triggers
	tSetChildData: {
		type: 'array',
		desc: 'When this is set, child nodes will be rendered when parents are expanded. Each record inside this array should contain a key corresponding with the \'patAtr\' value and that value should in turn be set to the \'dtaAtr\' of the parent node the data corresponds to',
		spec: [{ parentCode: 'dtaAtrValue1' }, { parentCode: 'dtaAtrValue2' }],
		setAction: (o = [], n) => {
			o.push(...n);

			return o;
		}
	},
	tRefreshNode: {
		type: 'array',
		desc: 'Contains a list of \'dtaAtr\' values that should have their corresponding nodes reload their data',
		dft: () => []
	},
	tRefreshParentNode: {
		type: 'array',
		desc: 'Contains a list of \'dtaAtr\' values that should have their corresponding parent nodes reload their data',
		dft: () => []
	},
	tToggleParent: {
		type: 'string',
		desc: 'Contains a \'dtaAtr\' value that should have its corresponding node be expanded or collapsed'
	},

	//Visual
	renderExpander: {
		type: 'boolean',
		desc: 'When this is set to true, an expander (defined by mdaExpander) will be rendered',
		dft: true
	},
	mdaExpander: {
		type: 'object',
		desc: 'The metadata for what should be rendered for each node\'s expand icon (where applicable). Note, this will not be rendered when renderExpander is false',
		dft: ({ dtaAtr }) => ({
			id: `((rowData.${dtaAtr}))expander`,
			type: 'container',
			prps: {
				overflow: 'hidden',
				canClick: true,
				vis: false,
				flows: [
					{
						from: '||treeview||',
						fromKey: `childData-((rowData.${dtaAtr}))`,
						toKey: 'vis'
					}
				],
				fireScript: {
					actions: [
						{
							type: 'setState',
							target: '||treeview||',
							key: 'tToggleParent',
							value: '{{state.||treenode||.data}}'
						}
					]
				}
			},
			wgts: [
				{
					type: 'icon',
					prps: {
						value: 'chevron_right',
						transform: 'rotate(0deg)',
						transitionProperty: 'transform',
						transitionDuration: '0.2s',
						flows: [
							{
								from: '||treenode||',
								fromKey: 'expanded',
								toKey: 'transform',
								mapFunction: v => v ? 'rotate(90deg)' : 'rotate(0deg)'
							}
						]
					}
				}
			]
		})
	},
	mdaLabel: {
		type: 'object',
		desc: 'The metadata for what should be rendered for each node\'s label element',
		dft: ({ disAtr, dtaAtr }) => ({
			id: `((rowData.${dtaAtr}))label`,
			type: 'container',
			prps: {
				dir: 'horizontal',
				canClick: true,
				fireScript: {
					actions: [
						{
							type: 'setState',
							target: '||treeview||',
							key: 'value',
							value: '{{rowData}}'
						}
					]
				}
			},
			wgts: [
				{
					type: 'label',
					prps: { cpt: `{{rowData.${disAtr}}}` }
				}
			]
		})
	},

	//Internal
	expandedNodes: {
		type: 'array',
		desc: 'A list of dtaAtr values corresponding to each node that has been expanded',
		internal: true,
		dft: () => []
	},
	droppedNode: {
		type: 'object',
		desc: 'An object that is set whenever a node is dropped in the treeview',
		internal: true,
		spec: {
			oldOwner: 'The record corresponding to the old owner of the dropped node',
			newOwner: 'The record corresponding to the new owner of the dropped node',
			node: 'The record corresponding to the dropped node',
			dropCausesCircularRef: 'Will be set to true when a node is dropped inside one of its descendents'
		}
	},
	mdaChildren: {
		type: 'object',
		desc: 'This is built internally and represents the full metadata to be rendered for the tree',
		internal: true
	},
	'childData-???': {
		type: 'array',
		desc: 'Whenever data is loaded through tSetChildData, it will be set in a key by the name of \'childData-abc\' where \'abc\' is the dtaAtr value of the node',
		internal: true
	}
};

export default Object.assign(props, propsSharedDataLoader, propsSharedDataLoaderExternal, {
	//Overrides
	data: {
		type: 'object',
		desc: 'Tree data is an object instead of an array. The root node (created internally) is said object',
		spec: {}
	}
});
