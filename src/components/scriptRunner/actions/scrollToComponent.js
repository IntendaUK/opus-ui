
const scrollToComponent = ({
	target,
	smooth = false,
	alignVertical = 'nearest',
	alignHorizontal = 'nearest'
}) => {
	const targetElement = document.getElementById(target);
	targetElement.scrollIntoView({
		behavior: smooth ? 'smooth' : 'auto',
		block: alignVertical,
		inline: alignHorizontal
	});
};

export default scrollToComponent;
