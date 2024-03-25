const exitList = [];

export const shouldExitLoop = loopId => {
	const result = exitList.some(l => l === loopId);

	exitList.spliceWhere(l => l === loopId);

	return result;
};

const exitLoop = async ({ loopIds }) => {
	loopIds.forEach(l => {
		if (exitList.includes(l))
			return;

		exitList.push(l);
	});
};

export default exitLoop;
