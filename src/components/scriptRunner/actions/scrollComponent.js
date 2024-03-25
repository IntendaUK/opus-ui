
const scrollComponent = ({
	target,
	targetSelector,
	targetSelectorAll,
	scrollPositionX = null,
	scrollPositionY = null,
	smooth = false
}) => {
	if (targetSelectorAll) {
		document.querySelectorAll(targetSelectorAll).forEach(node => {
			node.scrollTo({
				behavior: smooth ? 'smooth' : 'auto',
				top: scrollPositionY,
				left: scrollPositionX
			});
		});

		return;
	}

	const targetElement = targetSelector
		? document.querySelector(targetSelector)
		: document.getElementById(target);

	targetElement.scrollTo({
		behavior: smooth ? 'smooth' : 'auto',
		top: scrollPositionY,
		left: scrollPositionX
	});
};

export default scrollComponent;
