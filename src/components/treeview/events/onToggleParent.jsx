//System Helpers
import { clone, runScript } from '../../../library';

//External Helpers
import { generateWrapperMda } from './helpers';

//Helpers
import recurseFindNode from '../helpers/recurseFindNode';

//Event
const onToggleParent = props => {
	const { id, setState, state } = props;
	const { data, tToggleParent, dtaAtr, dtaScpsChildNode: scps, expandedNodes } = state;

	if (!tToggleParent)
		return;

	const expanded = expandedNodes.some(e => e === tToggleParent[dtaAtr]);
	if (expanded)
		expandedNodes.spliceWhere(e => e === tToggleParent[dtaAtr]);
	else
		expandedNodes.push(tToggleParent[dtaAtr]);

	const node = recurseFindNode(props, data, f => f[dtaAtr] === tToggleParent[dtaAtr]);

	if (!node.loaded && !expanded && scps) {
		const scpsArray = Array.isArray(scps) ? clone([], scps) : clone([], [ scps ]);
		scpsArray.forEach(s => {
			const scp = generateWrapperMda(props, [ [ node ] ], 0, s);

			scp.ownerId = id;

			runScript(scp);
		});
	}

	setState({
		expandedNodes,
		deleteKeys: ['tToggleParent']
	});
};

export default onToggleParent;
