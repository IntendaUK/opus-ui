const getComponentWidth = async (config, script) => {
	const { target = script.ownerId, getScrollWidth } = config;

	const el = document.getElementById(target);
	if (!el)
		return;

	const res = getScrollWidth ? el.scrollWidth : el.clientWidth;

	return res;
};

export default getComponentWidth;
