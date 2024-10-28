//System Helpers
import { clone, runScript } from '../../../library';

//External Helpers
import { generateWrapperMda } from './helpers';

//Helpers
import recurseFindNode from '../helpers/recurseFindNode';

//Event
const onRefreshParentNode = props => {
	const { id, setState, state } = props;
	const { data, tRefreshParentNode, dtaAtr, childAtr, dtaScpsChildNode: scps } = state;

	if (!tRefreshParentNode?.length)
		return;

	const newState = {
		data,
		deleteKeys: ['tRefreshParentNode']
	};

	const nodes = tRefreshParentNode
		.filter(e => e !== undefined)
		.map(e => {
			let parentNode = data;

			if (data[dtaAtr] !== e) {
				//Find the parent object in data
				parentNode = recurseFindNode(props, data, d => {
					return d[childAtr]?.some(c => c[dtaAtr] === e);
				});
			}

			delete parentNode[childAtr];
			newState[`childData-${parentNode[dtaAtr]}`] = null;

			return parentNode;
		});

	const scpsArray = Array.isArray(scps) ? clone([], scps) : clone([], [ scps ]);
	scpsArray.forEach(s => {
		const scp = generateWrapperMda(props, [ nodes ], 0, s);

		scp.ownerId = id;

		runScript(scp);
	});

	setState(newState);
};

export default onRefreshParentNode;
