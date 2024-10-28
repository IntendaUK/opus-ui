//Helpers
import recurseFindNode from '../helpers/recurseFindNode';

const setDataForChildNodes = (props, newData, newState) => {
	const { state: { dtaAtr, childAtr, staticData, autoExpandChildNodes } } = props;

	recurseFindNode(props, newData, f => {
		if (!!f[childAtr]) {
			newState[`childData-${f[dtaAtr]}`] = f[childAtr];

			if (!!staticData && f[childAtr].length) {
				f.loaded = true;

				if (autoExpandChildNodes)
					newState.expandedNodes.push(f[dtaAtr]);
			}
		}
	});
};

//Event
const onProcessData = props => {
	const { setState, state: { data, disAtr, dtaAtr, childAtr, autoExpand, rootNodeId } } = props;

	if (!data || !data.length || data?.[0]?.processed)
		return;

	const newData = {
		[dtaAtr]: rootNodeId,
		[disAtr]: 'root',
		processed: true,
		loaded: true,
		isRoot: true
	};

	if (data[0].isRoot)
		Object.assign(newData, data[0]);
	else
		newData[childAtr] = data;

	const newState = {
		data: newData,
		[`childData-${rootNodeId}`]: data,
		expandedNodes: []
	};

	if (autoExpand)
		newState.expandedNodes.push(rootNodeId);

	setDataForChildNodes(props, newData, newState);

	setState(newState);
};

export default onProcessData;
