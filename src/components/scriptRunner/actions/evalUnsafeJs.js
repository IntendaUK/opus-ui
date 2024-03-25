const evalUnsafeJs = async config => {
	const { value } = config;

	try {
		/* eslint-disable-next-line no-eval */
		await eval(value);
	} catch (e) {
		console.error(`EVALUATION CRASHED: ${value}`);
	}
};

export default evalUnsafeJs;
