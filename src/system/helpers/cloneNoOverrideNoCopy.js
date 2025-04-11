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

	cloneNoOverrideNoCopy(target, source);

	target: {
		a: 1,
		b: {
			bb: 20
		},
		c: 3
	}

	* Does not deep clone objects if they do not exist on the source
		* i.e. target.b will be the same object as source.b
	* Does not clone values from source into target if they already exist
		* i.e. target.c will not become 30
	* This should be used when we've already cloned source before calling the clone method or when we will not be using source for something else again.
*/

const isArray = Array.isArray;

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

const cloneNoOverrideNoCopy = function (o) {
	try {
		const aLen = arguments.length;
		for (let i = 1; i < aLen; i++)
			cloneRecursiveNoOverrideNoCopy(arguments[i], o);
	} catch (e) {
		throw e;
	}

	return o;
};

export default cloneNoOverrideNoCopy;
