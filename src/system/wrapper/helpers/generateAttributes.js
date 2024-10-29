const generateAttributes = state => {
	const { attrs } = state;

	if (!attrs)
		return;

	const res = {};

	attrs.forEach(a => {
		if (a === null)
			return;

		if (typeof(a) !== 'object') {
			res[a] = state[a];

			return;
		}

		const { key, attr } = a;

		res[attr] = state[key];
	});

	return res;
};

export default generateAttributes;
