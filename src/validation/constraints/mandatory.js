const handler = (value, cpt, { mandatory, errorOverrides }) => {
	if (!mandatory)
		return;

	if (
		value === undefined ||
		value === null ||
		(
			typeof(value) === 'string' &&
			!value.length
		)
	)
		return errorOverrides.mandatory || `${cpt} is mandatory.`;
};

export default handler;
