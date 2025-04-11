/*
	const target = {
		a: 1,
		c: 3
	};

	const source = {
		b: 20,
		c: 30
	};

	cloneNoOverride(target, source);

	target: {
		a: 1,
		b: 20,
		c: 3
	}

	* Does not clone values from source into target if they already exist
		* i.e. target.c will not become 30
	* This should be used when we've already cloned source before calling the clone method or when we will not be using source for something else again.
*/

const isArray = Array.isArray;

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

const cloneNoOverride = function (o) {
	try {
		const aLen = arguments.length;
		for (let i = 1; i < aLen; i++)
			cloneRecursiveNoOverride(arguments[i], o);
	} catch (e) {
		throw e;
	}

	return o;
};

export default cloneNoOverride;
