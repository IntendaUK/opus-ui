import clone from './helpers/clone';
import cloneNoOverride from './helpers/cloneNoOverride';
import cloneNoOverrideNoCopy from './helpers/cloneNoOverrideNoCopy';

import spliceWhere from './helpers/spliceWhere';

export { default as clone } from './helpers/clone';
export { default as cloneNoOverride } from './helpers/cloneNoOverride';
export { default as cloneNoOverrideNoCopy } from './helpers/cloneNoOverrideNoCopy';

export { default as spliceWhere } from './helpers/spliceWhere';

//Given an object { a: { b: { c: 10 } } }
//Can be called using getDeepPropertyArray(obj, ['a', b', 'c']) to access the value of `c`
export const getDeepPropertyArray = (obj, pathArray) => {
	if (!pathArray.length)
		return obj;

	pathArray
		.forEach(p => {
			if (obj)
				obj = obj[p];
		});

	return obj;
};

//Given an object { a: { b: { c: 10 } } }
//Can be called using getDeepProperty(obj, 'a.b.c') to access the value of `c`
export const getDeepProperty = (obj, path) => {
	if (!path)
		return obj;

	path
		.split('.')
		.forEach(p => {
			if (obj)
				obj = obj[p];
		});

	return obj;
};

export const generateGuid = () => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		let r = Math.random() * 16 | 0, v = c === 'x' ? r : ((r & 0x3) | 0x8);

		return v.toString(16);
	});
};

export const generateClassNames = (baseClass, config) => {
	return Object.entries(config).reduce((p, [k, v]) => {
		return p + (!!v ? ` ${k}` : '');
	}, baseClass);
};

export const isDecimal = value => {
	return (value % 1 !== 0);
};

const helperLookup = {
	clone,
	cloneNoOverride,
	cloneNoOverrideNoCopy,
	generateClassNames,
	generateGuid,
	getDeepProperty,
	getDeepPropertyArray,
	isDecimal,
	spliceWhere
};

/*
	config: {
		setAs: A string defining where the helpers should be set. If it equals "_" then window._ will be an object containing all required helpers.
		include: An array (with strings inside) of helpers to include. Refer to helperLookup above for available entries
		includeAll: A boolean. When set to true, all helpers will be included
	}
*/
const setOpusHelpersInWindow = ({
	setAs = '_',
	include,
	includeAll = false
}) => {
	if (includeAll === true)
		include = Object.keys(helperLookup);

	if (!include)
		return;
	else if (!Array.isArray(include)) {
		console.warn('The "exposeWindowHelpers" option must be an array containing strings.');

		return;
	} else if (include.length === 0)
		return;

	const windowHelpers = {};

	include.forEach(c => {
		const helper = helperLookup[c];
		if (!helper) {
			console.warn(`Invalid entry found in "exposeWindowHelpers": "${c}". Available entries are: ${Object.keys(helperLookup).join(', ')}`);

			return;
		}

		windowHelpers[c] = helperLookup[c];
	});

	window[setAs] = windowHelpers;
};

export { setOpusHelpersInWindow };
