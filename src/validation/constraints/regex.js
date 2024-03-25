const handler = (value = '', cpt, { regex, errorOverrides }) => {
	if (!regex)
		return;

	const regEx = new RegExp(regex, 'g');

	if (!regEx.test(value))
		return errorOverrides.regex || `${cpt} does not validate against the regular expression.`;
};

export default handler;
