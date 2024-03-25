import { onBlur } from './events';

export const unbindEvents = ({ state, setState }) => {
	const { domNode, eventHandler, blurHandler } = state;

	window.removeEventListener('resize', eventHandler);
	window.removeEventListener('scroll', eventHandler);
	window.removeEventListener('click', blurHandler);

	let iterator = domNode;
	do {
		iterator = iterator.parentNode;
		iterator.removeEventListener('scroll', eventHandler);
	} while (iterator.parentNode);

	setState({
		eventsBound: false,
		deleteKeys: ['eventHandler']
	});
};

export const updatePosition = (domNode, setState) => {
	const {
		left: domNodeX,
		top: domNodeY,
		height: domNodeHeight,
		width: domNodeWidth
	} = domNode.getBoundingClientRect();

	setState({
		domNodeX,
		domNodeY,
		domNodeHeight,
		domNodeWidth
	});
};

export const bindEvents = ({ getHandler, state, setState }) => {
	const { domNode } = state;
	const eventHandler = updatePosition.bind(this, domNode, setState);
	const blurHandler = getHandler(onBlur);

	setState({
		eventHandler,
		blurHandler,
		eventsBound: true
	});

	window.addEventListener('resize', eventHandler);
	window.addEventListener('scroll', eventHandler);

	let iterator = domNode;
	do {
		iterator = iterator.parentNode;
		iterator.addEventListener('scroll', eventHandler);
	} while (iterator.parentNode);

	window.addEventListener('mousedown', blurHandler);

	eventHandler();
};

const getElementZIndex = el => {
	if (el === document)
		return 0;

	const result = document.defaultView.getComputedStyle(el).getPropertyValue('z-index');
	if (isNaN(result))
		return getElementZIndex(el.parentNode);

	return result;
};

export const calculateStyles = ({
	domNode,
	domNodeX,
	domNodeY,
	domNodeHeight,
	domNodeWidth: width,
	lookupStyleOverrides
}) => {
	let minHeight = 86;
	let left = domNodeX;

	if (lookupStyleOverrides) {
		const { width: overrideWidth, overrideMinHeight } = lookupStyleOverrides;

		if (overrideWidth)
			left = `calc(${left}px - ((${overrideWidth} - ${width}px) / 2))`;

		if (overrideMinHeight)
			minHeight = overrideMinHeight;
	}

	let top = domNodeY + domNodeHeight + 11;
	let maxHeight = Math.max(0, window.innerHeight - top - 24);

	if (maxHeight < minHeight) {
		top += (maxHeight - minHeight);
		maxHeight = minHeight;
	}

	const zIndex = getElementZIndex(domNode) + 1;

	return {
		left,
		top,
		width,
		maxHeight,
		zIndex
	};
};
