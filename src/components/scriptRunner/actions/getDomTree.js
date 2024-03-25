//System Helpers
import { getDom } from '../../../system/managers/scopeManager';
import { stateManager } from '../../../system/managers/stateManager';
import { generateGuid } from '../../../system/helpers';

//Helpers
const buildDomTree = (dom, domNode, options) => {
	const { includeTypes, generateRandomGuids } = options;

	const node = {
		id: domNode.id,
		children: []
	};

	if (generateRandomGuids)
		node.guid = generateGuid();

	if (includeTypes === true) {
		const state = stateManager.getWgtState(domNode.id);

		node.type = state.type;
	}

	node.children = dom
		.filter(c => c.parentNode === domNode)
		.map(c => buildDomTree(dom, c, options));

	return node;
};

//Action
const getDomTree = async ({ rootId, includeTypes = false, generateRandomGuids = false }) => {
	const dom = getDom();

	const rootNode = dom.find(f => f.id === rootId);

	const domTree = buildDomTree(dom, rootNode, {
		includeTypes,
		generateRandomGuids
	});

	return domTree;
};

export default getDomTree;
