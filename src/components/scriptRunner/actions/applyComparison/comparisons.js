export const isEqual = (a, b) => {
	if (a === undefined || b === undefined || a === null || b === null)
		return a === b;

	//This is hacky. We should rather be more specific when we check types
	if (a.toLowerCase && b.toLowerCase)
		return a.toLowerCase() === b.toLowerCase();

	return a === b;
};

export const isEqualCase = (a, b) => a === b;

export const isNotEqual = (a, b) => {
	if (a === undefined || b === undefined)
		return a !== b;

	if (typeof(a) !== typeof(b))
		return true;

	if (a && a.toLowerCase && b && b.toLowerCase)
		return a.toLowerCase() !== b.toLowerCase();

	return a !== b;
};

export const isFalsy = a => {
	return (a === null || a === undefined || a === '' || a === 0 || a === false);
};

export const isNotFalsy = a => {
	return (a !== null && a !== undefined && a !== '' && a !== 0 && a !== false);
};

export const isTruthy = a => {
	return (a !== null && a !== undefined && a !== '' && a !== 0 && a !== false);
};

export const isNotTruthy = a => {
	return (a === null || a === undefined || a === '' || a === 0 || a === false);
};

export const isGreaterThan = (a, b) => a > b;

export const isGreaterEqualThan = (a, b) => a >= b;

export const isLessThan = (a, b) => a < b;

export const isLessEqualThan = (a, b) => a <= b;

export const isBetween = (a, b) => {
	const [b1, b2] = b.split('-').map(rangeValue => parseFloat(rangeValue));
	const parsedInput = parseFloat(a);

	return b1 < parsedInput && b2 > parsedInput;
};

export const isBetweenInclusive = (a, b) => {
	const [b1, b2] = b.split('-').map(rangeValue => parseFloat(rangeValue));
	const parsedInput = parseFloat(a);

	return b1 <= parsedInput && b2 >= parsedInput;
};

export const doesContain = (a, b) => a.toLowerCase().includes(b.toLowerCase());

export const doesNotContain = (a, b) => !doesContain(a, b);

export const containedIn = (a, b) => b.toLowerCase().includes(a.toLowerCase());

export const notContainedIn = (a, b) => !containedIn(a, b);

export const doesContainCase = (a, b) => a.includes(b);

export const doesNotContainCase = (a, b) => !doesContainCase(a, b);

export const containedInCase = (a, b) => b.includes(a);

export const notContainedInCase = (a, b) => !containedInCase(a, b);

export const isValidDateString = a => {
	const dateObject = new Date(a);
	const result = !isNaN(dateObject.getTime());

	return result;
};

export const isNotValidDateString = a => {
	return !isValidDateString(a);
};

export const isValidAgainstRegex = (a, r) => new RegExp(r).test(a);

export const isNotValidAgainstRegex = (a, r) => !isValidAgainstRegex(a, r);
