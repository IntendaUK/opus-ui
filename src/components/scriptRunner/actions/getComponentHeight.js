const getComponentHeight = async (config, script) => {
	const { target = script.ownerId, getScrollHeight } = config;

	const el = document.getElementById(target);
	if (!el)
		return;

	const res = getScrollHeight ? el.scrollHeight : el.clientHeight;

	return res;
};

export default getComponentHeight;
