//Helpers
const getAbsolutePosition = node => {
	let left = node.offsetLeft;
	let top = node.offsetTop;

	if (getComputedStyle(node).position !== 'absolute') {
		let parent = node.offsetParent;
		while (parent) {
			if (getComputedStyle(parent).position === 'absolute') {
				left += parent.offsetLeft;
				top += parent.offsetTop;

				break;
			} else {
				left += parent.offsetLeft;
				top += parent.offsetTop;
				parent = parent.offsetParent;
			}
		}
	}

	return {
		left,
		right: left + node.offsetWidth,
		top,
		bottom: top + node.offsetHeight,
		width: node.offsetWidth,
		height: node.offsetHeight
	};
};

//Action
const getComponentPosition = async (config, script) => {
	const { target = script.ownerId, getOffsetPosition = false } = config;

	const el = document.getElementById(target);
	if (!el)
		return;

	if (getOffsetPosition) {
		const offsetPosition = getAbsolutePosition(el);

		return offsetPosition;
	}

	return el.getBoundingClientRect();
};

export default getComponentPosition;
