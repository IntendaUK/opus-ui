/* eslint-disable max-len */

//System
import opusConfig from '../../../config';

//System Helpers
import { stateManager } from '../../../system/managers/stateManager';
import { getScopedId } from '../../../system/managers/scopeManager';

//Helpers
import { getFunction } from './functionManager';

//Helpers
const getDependencyId = (dependencies, id, selfId) => {
	const entry = dependencies.find(f => f.source === id || f.target === id);

	return entry.isScopedId ? getScopedId(`||${id}||`, selfId) : id;
};

const getState = (fnEntry, dependencies, ownerId, source, key) => {
	if (!dependencies.find(d => d.source === source)) {
		if (opusConfig.env === 'development') {
			//eslint-disable-next-line no-console
			console.error({
				msg: 'Function crashed',
				error: `Function ${fnEntry.name} does not have access to get source: ${source}`
			});
		} else {
			/* eslint-disable-next-line no-console */
			console.error('Function crashed');
		}

		return;
	}

	const invalidKey = !dependencies.some(d => d.source === source && d.keys.includes(key));
	if (invalidKey) {
		if (opusConfig.env === 'development') {
			//eslint-disable-next-line no-console
			console.error({
				msg: 'Function crashed',
				error: `Function ${fnEntry.name} does not have access to get key ${key} on source ${source}`
			});
		} else {
			/* eslint-disable-next-line no-console */
			console.error('Function crashed');
		}

		return;
	}

	let dependencyId = ownerId;
	if (source !== 'self')
		dependencyId = getDependencyId(dependencies, source, ownerId);

	return stateManager.getWgtState(dependencyId)?.[key];
};

const setState = (fnEntry, dependencies, ownerId, target, key, value) => {
	if (!dependencies.find(d => d.target === target)) {
		if (opusConfig.env === 'development') {
			//eslint-disable-next-line no-console
			console.error({
				msg: 'Function crashed',
				error: `Function ${fnEntry.name} does not have access to set target: ${target}`
			});
		} else {
			/* eslint-disable-next-line no-console */
			console.error('Function crashed');
		}

		return;
	}

	const invalidKey = !dependencies.some(d => d.target === target && d.keys.includes(key));
	if (invalidKey) {
		if (opusConfig.env === 'development') {
			//eslint-disable-next-line no-console
			console.error({
				msg: 'Function crashed',
				error: `Function ${fnEntry.name} does not have access to set key ${invalidKey} on target ${target}`
			});
		} else {
			/* eslint-disable-next-line no-console */
			console.error('Function crashed');
		}

		return;
	}

	let dependencyId = ownerId;
	if (target !== 'self')
		dependencyId = getDependencyId(dependencies, target, ownerId);

	stateManager.setWgtState(dependencyId, { [key]: value });
};

const setMultiState = (fnEntry, dependencies, ownerId, target, value) => {
	if (!dependencies.find(d => d.target === target)) {
		if (opusConfig.env === 'development') {
			//eslint-disable-next-line no-console
			console.error({
				msg: 'Function crashed',
				error: `Function ${fnEntry.name} does not have access to set target: ${target}`
			});
		} else {
			/* eslint-disable-next-line no-console */
			console.error('Function crashed');
		}

		return;
	}

	const invalidKey = Object.keys(value).find(k => {
		const isInvalid = !dependencies.some(d => d.target === target && d.keys.includes(k));

		return isInvalid;
	});
	if (invalidKey) {
		if (opusConfig.env === 'development') {
			//eslint-disable-next-line no-console
			console.error({
				msg: 'Function crashed',
				error: `Function ${fnEntry.name} does not have access to set key ${invalidKey} on target ${target}`
			});
		} else {
			/* eslint-disable-next-line no-console */
			console.error('Function crashed');
		}

		return;
	}

	let dependencyId = ownerId;
	if (target !== 'self')
		dependencyId = getDependencyId(dependencies, target, ownerId);

	stateManager.setWgtState(dependencyId, value);
};

//eslint-disable-next-line no-unused-vars, max-lines-per-function
export const invokeFunctionModule = ({ name, args, dependencies, ownerId }) => {
	const fnEntry = getFunction(name);
	if (!fnEntry.isModule) {
		if (opusConfig.env === 'development') {
			//eslint-disable-next-line no-console
			console.error({
				msg: 'Function is not a module',
				args: { module: name }
			});
		} else {
			/* eslint-disable-next-line no-console */
			console.error('Function module crashed');
		}
	}

	let result;

	try {
		result = fnEntry.fn.invoke({
			get: getState.bind(null, fnEntry, dependencies.stateGetters, ownerId),
			set: setState.bind(null, fnEntry, dependencies.stateSetters, ownerId),
			setMulti: setMultiState.bind(null, fnEntry, dependencies.stateSetters, ownerId)
		}, args);
	} catch (e) {
		if (opusConfig.env === 'development') {
			//eslint-disable-next-line no-console
			console.error({
				msg: 'Function module crashed',
				error: e,
				args: {
					args,
					module: name
				}
			});
		} else {
			/* eslint-disable-next-line no-console */
			console.error('Function module crashed');
		}
	}

	return result;
};
