const removeClass = (config, { ownerId }) => {
	const { target = ownerId, className } = config;

	const el = document.getElementById(target);
	const hasClass = el.classList.contains(className);

	if (hasClass)
		el.classList.remove(className);
};

export default removeClass;
