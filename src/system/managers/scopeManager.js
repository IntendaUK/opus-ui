/* eslint-disable max-lines-per-function, max-lines, complexity */

//System Helpers
import spliceWhere from '../helpers/spliceWhere';
import { stateManager } from './stateManager';

//List of nodes that are mounted
const dom = [];
const scopeOwnerLookup = {};
const inScopeLookup = {};
const domTree = {
	depth: 0,
	children: {},
	nodes: []
};
const maxNodesPerTreeNode = 10;

//Helpers
const iterateParentScopes = (node, scopes, parentScopeOwners) => {
	const { id, parentNode, ownScopes } = node;

	if (ownScopes && ownScopes.length) {
		scopes.push(...ownScopes.filter(s => !scopes.includes(s)));

		if (!parentScopeOwners.some(p => p.id === id))
			parentScopeOwners.push(node);
	}

	if (parentNode)
		return iterateParentScopes(parentNode, scopes, parentScopeOwners);
};

const getNodeFromRelIdInsideAncestor = (ancestorId, scope, relId) => {
	const lookup = inScopeLookup[scope];
	if (!lookup)
		return null;

	const nodes = lookup.filter(l => {
		const noMatch = (
			l.relId !== relId ||
			!l.parentScopeOwners.some(p => p.id === ancestorId)
		);

		return !noMatch;
	});

	if (nodes.length !== 1)
		return null;

	return nodes[0];
};

const getAllNodesFromRelIdInsideAncestor = (ancestorId, scope, relId) => {
	const lookup = inScopeLookup[scope];
	if (!lookup)
		return null;

	const nodes = lookup.filter(l => {
		const noMatch = (
			l.relId !== relId ||
			!l.parentScopeOwners.some(p => p.id === ancestorId)
		);

		return !noMatch;
	});

	return nodes;
};

const removeNodeFromDomTree = node => {
	const { id } = node;

	let treeNode = domTree;

	while (treeNode.depth < id.length) {
		const childNode = treeNode.children[id[treeNode.depth]];

		if (!childNode)
			break;

		treeNode = childNode;
	}

	if (treeNode.nodes.length === 0)
		delete treeNode.children['[[idMatch]]'];
	else
		spliceWhere(treeNode.nodes, n => n.id === id);
};

const findNodeInDomTree = id => {
	let treeNode = domTree;

	while (treeNode.depth < id.length) {
		const childNode = treeNode.children[id[treeNode.depth]];

		if (!childNode)
			break;

		treeNode = childNode;
	}

	let node;

	if (treeNode.nodes.length === 0 && treeNode.depth === id.length)
		node = treeNode.children['[[idMatch]]']?.nodes[0];
	else
		node = treeNode.nodes.find(n => n.id === id);

	return node;
};

//Exports
export const removeNodeFromDom = ({ id }) => {
	const nodeIndex = dom.findIndex(d => d.id === id);
	const node = dom[nodeIndex];

	dom.splice(nodeIndex, 1);
	removeNodeFromDomTree(node);

	node.ownScopes.forEach(o => {
		const lookup = scopeOwnerLookup[o];
		spliceWhere(lookup, l => l === node);

		if (lookup.length === 0)
			delete scopeOwnerLookup[o];
	});

	node.cachedInParents.forEach(p => spliceWhere(p.childNodesWithRelIds, f => f === node));

	node.scopes.forEach(s => {
		const lookup = inScopeLookup[s];

		if (!lookup)
			return;

		spliceWhere(lookup, l => l === node);

		if (lookup.length === 0)
			delete inScopeLookup[s];
	});
};

const splitDomTreeNode = treeNode => {
	const { nodes, depth } = treeNode;
	const newDepth = depth + 1;

	treeNode.nodes = [];

	nodes.forEach(n => {
		const char = n.id[depth] ?? '[[idMatch]]';

		const childNode = treeNode.children[char];

		if (!childNode) {
			treeNode.children[char] = {
				depth: newDepth,
				children: {},
				nodes: [ n ]
			};

			return;
		}

		childNode.nodes.push(n);
	});
};

const addNodeToDomTree = node => {
	const { id } = node;

	let treeNode = domTree;

	while (treeNode.depth < id.length) {
		const childNode = treeNode.children[id[treeNode.depth]];

		if (!childNode) {
			if (treeNode.nodes.length !== maxNodesPerTreeNode)
				break;
		} else
			treeNode = childNode;

		if (treeNode.nodes.length === maxNodesPerTreeNode)
			splitDomTreeNode(treeNode);
	}

	if (Object.keys(treeNode.children).length === 0)
		treeNode.nodes.push(node);
	else {
		const childNode = {
			depth: treeNode.depth + 1,
			children: {},
			nodes: [ node ]
		};

		treeNode.children[id[treeNode.depth] ?? '[[idMatch]]'] = childNode;
	}
};

let idDelayUpdateDevtools;

export const getNodesArrayForDevtools = () => {
	const res = dom.map(n => {
		const {
			id,
			ownScopes: scopes,
			relId,
			parentNode
		} = n;

		const node = {
			id,
			scopes,
			relId
		};

		const state = stateManager.getWgtState(id);
		node.type = state.type;

		if (state.flows?.length > 0)
			node.hasFlows = true;

		if (state.scps?.length > 0)
			node.hasScripts = true;

		if (parentNode)
			node.parentId = parentNode.id;

		return node;
	});

	return res;
};

export const addNodeToDom = mda => {
	const { id, relId, parentId, scope, namespace } = mda;

	const exists = findNodeInDomTree(id);
	if (exists)
		return;

	const parentNode = parentId ? findNodeInDomTree(parentId) : undefined;
	const scopes = [];
	const ownScopes = [];
	const parentScopeOwners = [];
	const childNodesWithRelIds = [];
	const cachedInParents = [];

	if (parentNode)
		iterateParentScopes(parentNode, scopes, parentScopeOwners);

	if (scope && !scopes.includes(scope)) {
		if (Array.isArray(scope))
			scopes.push(...scope);
		else
			scopes.push(scope);
	}

	if (scope) {
		if (scope instanceof Array)
			ownScopes.push(...scope);
		else
			ownScopes.push(scope);
	}

	const node = {
		id,
		relId,
		parentNode,
		scopes,
		ownScopes,
		parentScopeOwners,
		childNodesWithRelIds,
		cachedInParents,
		namespace
	};

	dom.push(node);

	addNodeToDomTree(node);

	ownScopes.forEach(o => {
		let lookup = scopeOwnerLookup[o];
		if (!lookup) {
			lookup = [];
			scopeOwnerLookup[o] = lookup;
		}

		lookup.push(node);
	});

	if (relId) {
		scopes.forEach(s => {
			if (!inScopeLookup[s])
				inScopeLookup[s] = [];

			inScopeLookup[s].push(node);
		});
	}

	if (window._OPUS_DEVTOOLS_GLOBAL_HOOK) {
		if (idDelayUpdateDevtools)
			clearTimeout(idDelayUpdateDevtools);

		idDelayUpdateDevtools = setTimeout(() => {
			const nodesDevtools = getNodesArrayForDevtools();

			window._OPUS_DEVTOOLS_GLOBAL_HOOK.onDomChanged(nodesDevtools);
		}, 100);
	}

	return node;
};

export const getScopedId = (scopeIdToken, selfId) => {
	let mustBeLocal = false;
	let scope;
	let relId;

	const split = scopeIdToken.replaceAll('||', '').split('.');
	if (split[0] === 'local' && split.length > 1) {
		mustBeLocal = true;
		scope = split[1];
		relId = split[2];
	} else {
		scope = split[0];
		relId = split[1];
	}

	let scopeOwner;

	let selfNode;
	if (selfId)
		selfNode = findNodeInDomTree(selfId);
	if (selfNode) {
		if (selfNode.ownScopes.includes(scope))
			scopeOwner = selfNode;
		else
			scopeOwner = selfNode.parentScopeOwners.find(o => o.ownScopes.includes(scope));

		if (!scopeOwner && mustBeLocal)
			return scopeIdToken;
	}

	if (!scopeOwner) {
		//If we can't find anything, we find any component (anywhere) that owns the scope
		const lookup = scopeOwnerLookup[scope];
		if (!lookup)
			return scopeIdToken;

		if (!relId) {
			if (lookup.length !== 1)
				return scopeIdToken;

			return lookup[0].id;
		}

		const relIdNodeOptions = [];
		lookup.forEach(l => {
			l.childNodesWithRelIds.forEach(f => {
				if (f.relId === relId)
					relIdNodeOptions.push(f);
			});
		});

		if (relIdNodeOptions.length === 0) {
			lookup.forEach(l => {
				const option = getNodeFromRelIdInsideAncestor(l.id, scope, relId);

				if (option) {
					l.childNodesWithRelIds.push(option);
					option.cachedInParents.push(l);

					relIdNodeOptions.push(option);
				}
			});

			if (relIdNodeOptions.length !== 1)
				return scopeIdToken;

			return relIdNodeOptions[0].id;
		} else if (relIdNodeOptions.length > 1)
			return scopeIdToken;

		return relIdNodeOptions[0].id;
	}

	if (!relId)
		return scopeOwner.id;

	let scopedId;

	let relIdNode = scopeOwner.childNodesWithRelIds.find(n => n.relId === relId);
	if (!relIdNode) {
		relIdNode = getNodeFromRelIdInsideAncestor(scopeOwner.id, scope, relId);

		if (relIdNode) {
			scopeOwner.childNodesWithRelIds.push(relIdNode);
			relIdNode.cachedInParents.push(scopeOwner);

			scopedId = relIdNode.id;
		} else
			scopedId = scopeIdToken;
	} else
		scopedId = relIdNode.id;

	return scopedId;
};

export const getAllScopedIds = (scopeIdToken, selfId) => {
	const [scope, relId] = scopeIdToken.split('||').join('').split('.');

	let scopeOwner;

	let selfNode;
	if (selfId)
		selfNode = findNodeInDomTree(selfId);
	if (selfNode) {
		if (selfNode.ownScopes.includes(scope))
			scopeOwner = selfNode;
		else
			scopeOwner = selfNode.parentScopeOwners.find(o => o.ownScopes.includes(scope));
	}

	if (!scopeOwner) {
		//If we can't find anything, we find any component (anywhere) that owns the scope
		const lookup = scopeOwnerLookup[scope];
		if (!lookup)
			return [];

		if (!relId) {
			const scopedOwnerIds = lookup.map(l => l.id);

			return scopedOwnerIds;
		}

		const relIdNodeOptions = [];
		lookup.forEach(l => {
			l.childNodesWithRelIds.forEach(f => {
				if (f.relId === relId)
					relIdNodeOptions.push(f);
			});
		});

		if (relIdNodeOptions.length === 0) {
			lookup.forEach(l => {
				const option = getNodeFromRelIdInsideAncestor(l.id, scope, relId);

				if (option) {
					l.childNodesWithRelIds.push(option);
					option.cachedInParents.push(l);

					relIdNodeOptions.push(option);
				}
			});
		}

		const relIds = relIdNodeOptions.map(r => r.id);

		return relIds;
	}

	if (!relId)
		return [scopeOwner.id];

	let relIdNodes = scopeOwner.childNodesWithRelIds.filter(n => n.relId === relId);
	if (!relIdNodes.length)
		relIdNodes = getAllNodesFromRelIdInsideAncestor(scopeOwner.id, scope, relId);

	const relIdNodeIds = relIdNodes.map(r => r.id);

	return relIdNodeIds;
};

export const isIdInDom = id => {
	const result = dom.some(d => d.id === id);

	return result;
};

export const getDom = () => dom;

export const getNodeNamespace = id => {
	let node = dom.find(d => d.id === id);

	while (node !== undefined && !node.namespace)
		node = node.parentNode;

	return node?.namespace;
};

export const getFilteredParentList = ids => {
	const res = [];

	ids.forEach(id => {
		let node = findNodeInDomTree(id);
		if (!node)
			return;

		let foundParentInIds = false;

		//Only include the node if none of the other id's are its parent
		while (node.parentNode) {
			node = node.parentNode;

			if (ids.some(f => f === node.id)) {
				foundParentInIds = true;

				break;
			}
		}

		if (!foundParentInIds)
			res.push(id);
	});

	return res;
};
