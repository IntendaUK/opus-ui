const isNil = v => v === null || v === undefined;

const isObj = v => typeof(v) === 'object' && v !== null;

const toStr = v => {
	if (isNil(v))
		return '';

	return String(v);
};

const toLower = v => toStr(v).toLowerCase();

const toNum = v => {
	const n = parseFloat(v);

	return Number.isNaN(n) ? undefined : n;
};

//Deep structural equality. Containers are compared key/element-wise; leaves fall back to the
// same loose, case-insensitive rule as isEqual. This is needed because String()-coercing an
// object yields "[object Object]" for EVERY object — so toLower/toStr-based comparisons treat
// any two objects as equal (and as "containing" each other). Deep-compare instead so distinct
// object values (e.g. two colour preferences) are correctly seen as different.
const deepEqual = (a, b) => {
	if (a === b)
		return true;

	//At least one side is a primitive: only equal if BOTH are primitives that loosely match.
	if (!isObj(a) || !isObj(b))
		return !isObj(a) && !isObj(b) && toLower(a) === toLower(b);

	if (Array.isArray(a) !== Array.isArray(b))
		return false;

	const keys = Object.keys(a);
	if (keys.length !== Object.keys(b).length)
		return false;

	return keys.every(k => deepEqual(a[k], b[k]));
};

export const isEqual = (a, b) => {
	if (isNil(a) || isNil(b))
		return a === b;

	return deepEqual(a, b);
};

export const isEqualCase = (a, b) => a === b;

export const isNotEqual = (a, b) => !isEqual(a, b);

export const isFalsy = a => (
	a === null || a === undefined || a === '' || a === 0 || a === false
);

export const isNotFalsy = a => !isFalsy(a);

export const isTruthy = a => !isFalsy(a);

export const isNotTruthy = a => isFalsy(a);

export const isGreaterThan = (a, b) => {
	const na = toNum(a);
	const nb = toNum(b);

	if (na === undefined || nb === undefined)
		return false;

	return na > nb;
};

export const isGreaterEqualThan = (a, b) => {
	const na = toNum(a);
	const nb = toNum(b);

	if (na === undefined || nb === undefined)
		return false;

	return na >= nb;
};

export const isLessThan = (a, b) => {
	const na = toNum(a);
	const nb = toNum(b);

	if (na === undefined || nb === undefined)
		return false;

	return na < nb;
};

export const isLessEqualThan = (a, b) => {
	const na = toNum(a);
	const nb = toNum(b);

	if (na === undefined || nb === undefined)
		return false;

	return na <= nb;
};

const parseRange = b => {
	if (isNil(b))
		return [];

	return String(b).split('-').map(v => toNum(v));
};

export const isBetween = (a, b) => {
	const [b1, b2] = parseRange(b);
	const val = toNum(a);

	if (val === undefined || b1 === undefined || b2 === undefined)
		return false;

	return b1 < val && b2 > val;
};

export const isBetweenInclusive = (a, b) => {
	const [b1, b2] = parseRange(b);
	const val = toNum(a);

	if (val === undefined || b1 === undefined || b2 === undefined)
		return false;

	return b1 <= val && b2 >= val;
};

//`a` contains `b`. Arrays test membership (deep/loose per element); strings test substring.
// An object operand can't be a meaningful substring, so guard against the "[object Object]"
// collapse that would otherwise report any two objects as containing each other.
export const doesContain = (a, b) => {
	if (isNil(a) || isNil(b))
		return false;

	if (Array.isArray(a))
		return a.some(el => isEqual(el, b));

	if (isObj(a) || isObj(b))
		return false;

	return toLower(a).includes(toLower(b));
};

export const doesNotContain = (a, b) => !doesContain(a, b);

export const containedIn = (a, b) => doesContain(b, a);

export const notContainedIn = (a, b) => !containedIn(a, b);

export const doesContainCase = (a, b) => {
	if (isNil(a) || isNil(b))
		return false;

	if (Array.isArray(a))
		return a.some(el => isEqualCase(el, b));

	if (isObj(a) || isObj(b))
		return false;

	return toStr(a).includes(toStr(b));
};

export const doesNotContainCase = (a, b) => !doesContainCase(a, b);

export const containedInCase = (a, b) => doesContainCase(b, a);

export const notContainedInCase = (a, b) => !containedInCase(a, b);

export const isValidDateString = a => {
	if (isNil(a))
		return false;

	const date = new Date(a);

	return !Number.isNaN(date.getTime());
};

export const isNotValidDateString = a => !isValidDateString(a);

export const isValidAgainstRegex = (a, r) => {
	if (isNil(a) || isNil(r))
		return false;

	try {
		return new RegExp(r).test(String(a));
	} catch {
		return false;
	}
};

export const isNotValidAgainstRegex = (a, r) =>
	!isValidAgainstRegex(a, r);
