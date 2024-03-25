const handler = (value, cpt, { minWords, errorOverrides }) => {
	if (
		minWords === undefined ||
		value === undefined ||
		value === null
	)
		return;

	const splitValue = (value + '')
		.trimLeft()
		.trimRight()
		.split(' ');

	if (splitValue.length < minWords)
		return errorOverrides.minWords || `${cpt} may not be less than ${minWords} words.`;
};

export default handler;
