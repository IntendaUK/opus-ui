const wait = async ({ duration }) => {
	await (new Promise(res => {
		setTimeout(res, duration);
	}));
};

export default wait;
