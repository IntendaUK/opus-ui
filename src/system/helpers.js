/* eslint-disable max-lines */

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

export const resolveRelativePath = (path, cwd) => {
	if (path.indexOf('./') !== 0)
		return path;

	let result = cwd;

	const splitPath = path.split('/');

	splitPath.forEach(s => {
		if (s === '.')
			return;
		else if (s === '..')
			result = result.substr(0, result.lastIndexOf('/'));
		else if (result.length > 0)
			result += '/' + s;
		else
			result += s;
	});

	return result;
};

const isArray = Array.isArray;

/* eslint-disable-next-line complexity */
const cloneRecursive = function (o, newO) {
	if (typeof o !== 'object' || !o)
		return o;

	if (isArray(o)) {
		if (newO === undefined || !isArray(newO))
			newO = [];

		const len = o.length;
		for (let i = 0; i < len; i++)
			newO[i] = cloneRecursive(o[i], newO[i]);

		return newO;
	}

	if (!newO || typeof(newO) !== 'object')
		newO = {};
	for (let i in o) {
		if (!o.hasOwnProperty(i))
			continue;

		const newValue = cloneRecursive(o[i], newO[i]);

		newO[i] = newValue;
	}

	return newO;
};

//Deep clones an object
export const clone = function (o) {
	try {
		const aLen = arguments.length;
		for (let i = 1; i < aLen; i++)
			cloneRecursive(arguments[i], o);
	} catch (e) {
		throw e;
	}

	return o;
};

/* eslint-disable-next-line complexity */
const cloneRecursiveNoOverride = function (o, newO) {
	if (typeof o !== 'object' || !o)
		return o;

	if (isArray(o)) {
		if (!newO?.push)
			newO = [];

		for (let i = 0; i < o.length; i++)
			newO[i] = cloneRecursiveNoOverride(o[i], newO[i]);

		return newO;
	}

	if (!newO || typeof(newO) !== 'object')
		newO = {};

	for (let i in o) {
		if (!o.hasOwnProperty(i))
			continue;

		const newValue = cloneRecursiveNoOverride(o[i], newO[i]);

		const setValue = (
			newO[i] === undefined ||
			(
				typeof newValue === 'object' &&
				newValue !== null
			)
		);

		if (!setValue)
			continue;

		newO[i] = newValue;
	}

	return newO;
};

//Deep clones an object but doesn't override values in object A with values in B
export const cloneNoOverride = function (o) {
	try {
		const aLen = arguments.length;
		for (let i = 1; i < aLen; i++)
			cloneRecursiveNoOverride(arguments[i], o);
	} catch (e) {
		throw e;
	}

	return o;
};

/* eslint-disable-next-line complexity, max-lines-per-function */
const cloneRecursiveNoOverrideNoCopy = function (o, newO) {
	if (typeof o !== 'object' || !o)
		return o;

	if (isArray(o)) {
		if (!newO?.push)
			newO = [];

		for (let i = 0; i < o.length; i++)
			newO[i] = cloneRecursiveNoOverrideNoCopy(o[i], newO[i]);

		return newO;
	}

	if (!newO || typeof(newO) !== 'object')
		newO = {};

	for (let i in o) {
		if (!o.hasOwnProperty(i))
			continue;

		if (newO[i] === undefined) {
			newO[i] = o[i];

			continue;
		}

		const newValue = cloneRecursiveNoOverrideNoCopy(o[i], newO[i]);

		const setValue = (
			newO[i] === undefined ||
			(
				typeof newValue === 'object' &&
				newValue !== null
			)
		);

		if (!setValue)
			continue;

		newO[i] = newValue;
	}

	return newO;
};

//Deep clones an object but doesn't override values in object A with values in B
export const cloneNoOverrideNoCopy = function (o) {
	try {
		const aLen = arguments.length;
		for (let i = 1; i < aLen; i++)
			cloneRecursiveNoOverrideNoCopy(arguments[i], o);
	} catch (e) {
		throw e;
	}

	return o;
};
