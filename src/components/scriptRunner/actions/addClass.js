const addClass = (config, { ownerId }) => {
	const { target = ownerId, className } = config;

	const el = document.getElementById(target);
	const hasClass = el.classList.contains(className);

	if (!hasClass)
		el.classList.add(className);
};

export default addClass;
