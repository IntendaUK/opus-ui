//The purpose of this method is two-fold:
// 1. Applies flow defaults
// 2. Converts list flows (shorthand flows with multiple keys defined) into multiple explicit flows

//System Helpers
import { clone } from '../../../helpers';

//Helpers
import { getMappedFrom, getMappedTo } from './getMappedId';
import { globalScopeName } from '../stores/storeListeners';

//These are the fields that can be 'listed'.
// Note that if more than one of these are present, it is required that they are all the same length
const listFields = [
	'fromList',
	'fromKeyList',
	'fromSubKeyList',
	'toSubKeyList',
	'toList',
	'toKeyList'
];

const buildFlowList = config => {
	const result = [];

	//Find any list so that we can loop over it (we need the length)
	const firstListKey = listFields.find(l => config[l] !== undefined);
	const firstList = config[firstListKey];

	firstList.forEach((x, i) => {
		const flow = clone({}, config);

		listFields.forEach(l => {
			const list = flow[l];

			if (list === undefined)
				return;

			delete flow[l];

			const newKey = l.replace('List', '');
			flow[newKey] = list[i];
		});

		result.push(flow);
	});

	return result;
};

const applyFlowDefaults = (flow, ownerId) => {
	const {
		fromKey = 'value',
		fromSubKey,
		toKey = 'value',
		toSubKey,
		mapFunctionString,
		scope = ownerId,
		globalScope
	} = flow;

	const useScope = globalScope ? globalScopeName : scope;

	Object.assign(flow, {
		fromKey,
		fromSubKey,
		toKey,
		toSubKey,
		scope: useScope,
		ownerId
	});

	if (!flow.from && !flow.fromTag)
		flow.from = ownerId;

	if (!flow.to && !flow.toTag)
		flow.to = ownerId;

	if (mapFunctionString) {
		delete flow.mapFunctionString;

		/* eslint-disable-next-line no-eval */
		flow.mapFunction = eval(mapFunctionString);
	}
};

//Exports
const getTransformedFlows = (flows, ownerId) => {
	const result = [];

	flows.forEach(f => {
		const isListFlow = listFields.some(l => f[l] !== undefined);

		if (isListFlow) {
			const list = buildFlowList(f);
			result.push(...list);

			return;
		}

		result.push(f);
	});

	result.forEach(r => {
		applyFlowDefaults(r, ownerId);

		r.from = getMappedFrom(r);
		r.to = getMappedTo(r);
	});

	return result;
};

export default getTransformedFlows;
