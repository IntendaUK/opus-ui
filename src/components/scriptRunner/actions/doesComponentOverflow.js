const doesComponentOverflow = async (config, script) => {
	const { target = script.ownerId, axisX, axisY } = config;

	const el = document.getElementById(target);
	if (!el)
		return false;

	if (axisX)
		return el.scrollWidth > el.clientWidth;

	if (axisY)
		return el.scrollHeight > el.clientHeight;

	return false;
};

export default doesComponentOverflow;
