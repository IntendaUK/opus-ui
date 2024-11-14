const suites = {};

export const set = ({ suite, method = 'default', isAsync, handler }) => {
	if (!suites[suite])
		suites[suite] = {};

	suites[suite][method] = {
		handler,
		isAsync
	};
};

export const get = ({ suite, method = 'default' }) => {
	const res = suites[suite]?.[method];

	return res;
};
