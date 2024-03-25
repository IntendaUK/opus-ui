//System Helpers
import { isIdInDom } from '../../../system/managers/scopeManager';

//Helpers
import { applyComparison } from '../actions';

const getAllComponentIds = parentId => {
	let parent = document;
	if (parentId)
		parent = document.getElementById(parentId);

	const result = [];

	const selector = '[class^=\'cpn\']';
	const nodes = [...parent.querySelectorAll(selector)];
	const nLen = nodes.length;

	for (let i = 0; i < nLen; i++) {
		const id = nodes[i].id;
		const isInDom = isIdInDom(id);
		if (!isInDom)
			continue;

		result.push(id);
	}

	return result;
};

const getNextId = (componentIds, currentId, allowCircular) => {
	const currentIndex = componentIds.indexOf(currentId);

	let nextIndex = currentIndex + 1;
	if (nextIndex >= componentIds.length) {
		if (allowCircular)
			nextIndex = 0;
		else
			return;
	}

	return componentIds[nextIndex];
};

const getNextIdRecursively = (config, script, props) => {
	const { match, allowCircular, parentId } = config;

	const startAtId = config.startAtId ?? script.ownerId;

	const componentIds = getAllComponentIds(parentId);

	let nextId = startAtId;

	do {
		nextId = getNextId(componentIds, nextId, allowCircular);

		const { operator, key, value, compareValue } = match;

		const isMatch = applyComparison({
			operator,
			source: nextId,
			key,
			value,
			compareValue
		}, script, props);

		if (isMatch)
			break;
	} while (nextId);

	return nextId;
};

//Actions
const getNextComponentId = (config, script, props) => {
	const { match, allowCircular, parentId } = config;

	const startAtId = config.startAtId ?? script.ownerId;

	if (match)
		return getNextIdRecursively(config, script, props);

	const componentIds = getAllComponentIds(parentId);
	const nextId = getNextId(componentIds, startAtId, allowCircular);

	return nextId;
};

export default getNextComponentId;
