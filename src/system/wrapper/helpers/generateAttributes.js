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

		res[key] = state[attr];
	});

	return res;
};

export default generateAttributes;
