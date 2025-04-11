/*
	const target = {
		a: 1,
		c: 3
	};

	const source = {
		b: {
			bb: 20
		},
		c: 30
	};

	clone(target, source);

	target: {
		a: 1,
		b: {
			bb: 20
		},
		c: 30
	}
*/

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

const clone = function (o) {
	try {
		const aLen = arguments.length;
		for (let i = 1; i < aLen; i++)
			cloneRecursive(arguments[i], o);
	} catch (e) {
		throw e;
	}

	return o;
};

export default clone;
