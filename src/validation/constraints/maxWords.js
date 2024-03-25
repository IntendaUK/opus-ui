const createWordsArray = value => {
	if (value === '')
		return [];

	const wordsArray = value
		.trimLeft()
		.trimRight()
		.split(' ');

	return wordsArray;
};

const handler = (value, cpt, { maxWords, errorOverrides }) => {
	if (
		maxWords === undefined ||
		value === undefined ||
		typeof(value) !== 'string' ||
		value === null
	)
		return;

	const wordsArray = createWordsArray(value);

	if (wordsArray.length > maxWords)
		return errorOverrides.maxWords || `${cpt} may not be longer than ${maxWords} words.`;
};

export const enforcer = ({ maxWords }, value) => {
	const wordsArray = createWordsArray(value);
	wordsArray.length = maxWords;
	const newValue = wordsArray.join(' ');

	return newValue;
};

export default handler;
