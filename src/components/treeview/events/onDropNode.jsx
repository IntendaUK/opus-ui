/* eslint-disable max-lines-per-function */

//Helpers
import recurseFindNode from '../helpers/recurseFindNode';
import buildNodeId from '../helpers/buildNodeId';

//Event
const onDropNode = (props, a) => {
	const { setState, state } = props;
	const { data, dtaAtr, childAtr, moveOnDrop } = state;

	const droppedRecord = a.dropper.prps[a.dropper.prps.recordAtr];
	const node = recurseFindNode(props, data, d => d[dtaAtr] === droppedRecord[dtaAtr]);

	//Find the new owner object in data
	const newOwner = recurseFindNode(props, data, d => {
		return buildNodeId(props, d) + 'dnd' === a.target;
	});

	//Find the previous owner object in data
	// If the dropped node came from outside the tree, node will be undefined
	let oldOwner = null;
	let dropCausesCircularRef = false;
	if (node) {
		oldOwner = recurseFindNode(props, data, d => {
			return d[childAtr]?.some(c => c[dtaAtr] === node[dtaAtr]);
		});

		//Figure out if the newOwner is a child of the node (don't explode the universe)
		dropCausesCircularRef = !!recurseFindNode(props, node, n => n[dtaAtr] === newOwner[dtaAtr]);
	}

	const newState = {
		data,
		droppedNode: {
			oldOwner,
			newOwner,
			node: node ?? droppedRecord,
			dropCausesCircularRef
		},
		deleteKeys: []
	};

	if (moveOnDrop && oldOwner) {
		//Remove from previous owner
		oldOwner[childAtr].spliceWhere(c => c[dtaAtr] === node[dtaAtr]);

		if (!oldOwner[childAtr].length) {
			delete oldOwner[childAtr];
			newState[`childData-${oldOwner[dtaAtr]}`] = null;
		} else
			newState[`childData-${oldOwner[dtaAtr]}`] = oldOwner[childAtr];
	}

	if (moveOnDrop) {
		if (!newOwner[childAtr])
			newOwner[childAtr] = [];

		//Add to new owner
		newOwner[childAtr].push(node);

		newState[`childData-${newOwner[dtaAtr]}`] = newOwner[childAtr];
	}

	setState(newState);
};

export default onDropNode;
