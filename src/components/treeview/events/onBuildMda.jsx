/* eslint-disable max-lines-per-function */

//External Helpers
import { generateWrapperMda } from './helpers';

//Events
import onDropNode from './onDropNode';

//Helpers
import buildNodeId from '../helpers/buildNodeId';

//Helpers
const buildCanDragContents = (props, data, id, label) => {
	const { getHandler, state: { recordAtr, dragTargets, prpsContainerDnd } } = props;

	const handlerOnDrop = getHandler(onDropNode);

	const contents = {
		id: id + 'dnd',
		type: 'containerDnd',
		scope: 'treenodednd',
		prps: {
			dragTargets,
			dir: 'horizontal',
			overflow: 'hidden',
			removeOnDrop: false,
			addOnDrop: false,
			dropPlaceholderMda: {
				id: 'dropper' + id,
				type: 'icon',
				prps: {
					color: 'mediumGrey',
					value: 'add'
				}
			},
			handlerOnDrop,
			...prpsContainerDnd
		},
		wgts: [
			{
				id: id + 'inner',
				type: 'containerSimple',
				prps: { flex: true },
				wgts: [
					{
						id: id + 'dragger',
						type: 'dragger',
						scope: 'treenodedragger',
						prps: {
							flex: true,
							[recordAtr]: data,
							recordAtr
						},
						wgts: [label]
					}
				]
			}
		]
	};

	return contents;
};

const buildContents = (props, data, id, label) => {
	const { state: { prpsContainerDnd } } = props;

	const contents = {
		id: id + 'dnd',
		type: 'containerSimple',
		scope: 'treenodednd',
		prps: {
			dir: 'horizontal',
			overflow: 'hidden',
			...prpsContainerDnd
		},
		wgts: [
			{
				id: id + 'inner',
				type: 'containerSimple',
				prps: { flex: true },
				wgts: [label]
			}
		]
	};

	return contents;
};

const buildLabel = (props, data) => {
	const { state: { dtaAtr, mdaLabel, renderExpander, mdaExpander } } = props;

	const label = generateWrapperMda(props, [data], 0, mdaLabel);

	if (renderExpander) {
		const expander = generateWrapperMda(props, [data], 0, mdaExpander);

		expander.prps.vis = !!props.state[`childData-${data[dtaAtr]}`];

		label.wgts.splice(0, 0, expander);
	}

	return label;
};

const recurse = (props, data, level = 0, index = 0) => {
	const { state: { childAtr, dtaAtr } } = props;
	const { state: { levelLeftMarginSize, expandedNodes, noPad, canDragAndDrop } } = props;
	const { state: { traitsTreeNode, prpsTreeNode } } = props;

	const id = buildNodeId(props, data);

	const expanded = expandedNodes.some(e => e === data[dtaAtr]);

	const fnContents = canDragAndDrop ? buildCanDragContents : buildContents;

	const label = buildLabel(props, data);

	const contents = fnContents(props, data, id, label);

	const mda = {
		scope: 'treenode',
		id: id + 'container',
		parentId: props.id,
		type: 'containerSimple',
		auth: ['data', 'expanded'],
		traits: traitsTreeNode,
		prps: {
			dir: 'vertical',
			marginLeft: (level && !noPad) ? levelLeftMarginSize : undefined,
			data,
			expanded,
			isFirstNode: index === 0,
			level,
			...prpsTreeNode
		},
		wgts: [contents]
	};

	mda.wgts.push({
		id: id + 'children',
		type: 'containerSimple',
		prps: {
			dir: 'vertical',
			vis: !!expanded
		},
		auth: ['vis'],
		wgts: data[childAtr]?.map((c, i) => recurse(props, c, level + 1, i))
	});

	return mda;
};

//Event
const onBuildMda = props => {
	const { setState, state: { data, tSetChildData } } = props;

	if (!data?.processed || tSetChildData?.length)
		return;

	const mdaChildren = recurse(props, data);

	setState({ mdaChildren });
};

export default onBuildMda;
