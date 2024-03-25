const handler = (value = '', cpt, { notRegex, errorOverrides }) => {
	if (!notRegex)
		return;

	const regEx = new RegExp(notRegex, 'g');

	if (regEx.test(value))
		return errorOverrides.notRegex || `${cpt} does not validate against the regular expression.`;
};

export default handler;
