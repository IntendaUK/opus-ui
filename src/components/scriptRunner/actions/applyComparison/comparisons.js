const isNil = v => v === null || v === undefined;

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

export const isEqual = (a, b) => {
	if (isNil(a) || isNil(b))
		return a === b;

	return toLower(a) === toLower(b);
};

export const isEqualCase = (a, b) => a === b;

export const isNotEqual = (a, b) => {
	if (isNil(a) || isNil(b))
		return a !== b;

	return toLower(a) !== toLower(b);
};

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

export const doesContain = (a, b) => {
	if (isNil(a) || isNil(b))
		return false;

	return toLower(a).includes(toLower(b));
};

export const doesNotContain = (a, b) => !doesContain(a, b);

export const containedIn = (a, b) => {
	if (isNil(a) || isNil(b))
		return false;

	return toLower(b).includes(toLower(a));
};

export const notContainedIn = (a, b) => !containedIn(a, b);

export const doesContainCase = (a, b) => {
	if (isNil(a) || isNil(b))
		return false;

	return toStr(a).includes(toStr(b));
};

export const doesNotContainCase = (a, b) => !doesContainCase(a, b);

export const containedInCase = (a, b) => {
	if (isNil(a) || isNil(b))
		return false;

	return toStr(b).includes(toStr(a));
};

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
