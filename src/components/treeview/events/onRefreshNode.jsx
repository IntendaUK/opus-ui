//System Helpers
import { clone, runScript } from '../../../library';

//External Helpers
import { generateWrapperMda } from './helpers';

//Helpers
import recurseFindNode from '../helpers/recurseFindNode';

const generateScript = (props, nodes, [ scp ], newState) => {
	const script = generateWrapperMda(props, [ nodes ], 0, scp);
	script.ownerId = props.id;

	const finalState = script.actions[script.actions.length - 1].value;

	Object.assign(finalState, newState);

	Object.entries(finalState).forEach(([k, v]) => {
		if (typeof(v) === 'string' && v.indexOf('{{variable.') === 0)
			finalState[k] = v.replace('{{variable.', `{{${script.id}.variable.`);
		else
			finalState[k] = v;
	});

	return script;
};

//Event
const onRefreshNode = props => {
	const { state } = props;
	const { dtaAtr, childAtr, data, tRefreshNode } = state;
	const { dtaScpsChildNode: scps, autoExpandChildNodes } = state;

	if (!tRefreshNode?.length)
		return;

	const newState = {
		data,
		deleteKeys: ['tRefreshNode']
	};

	const nodes = tRefreshNode
		.filter(e => e !== undefined)
		.map(e => recurseFindNode(props, data, d => {
			return d[dtaAtr] === e;
		}));

	nodes.forEach(n => {
		delete n[childAtr];
		newState[`childData-${n[dtaAtr]}`] = null;

		if (autoExpandChildNodes && !state.expandedNodes.includes(n[dtaAtr]))
			newState.expandedNodes = [...state.expandedNodes, n[dtaAtr]];
	});

	const scpsArray = Array.isArray(scps) ? clone([], scps) : clone([], [ scps ]);

	const script = generateScript(props, nodes, scpsArray, newState);

	runScript(script);
};

export default onRefreshNode;
