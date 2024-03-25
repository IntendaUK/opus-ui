//Action
const removeStylesheet = ({ target, targetSelector,	targetSelectorAll }) => {
	if (targetSelectorAll) {
		document.querySelectorAll(targetSelectorAll).forEach(el => {
			el.remove();
		});

		return;
	}

	const targetElement = targetSelector
		? document.querySelector(targetSelector)
		: document.getElementById(target);

	targetElement.remove();
};

export default removeStylesheet;
