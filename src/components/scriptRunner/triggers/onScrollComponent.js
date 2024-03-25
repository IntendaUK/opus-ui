//System Helpers
import { getScopedId } from '../../../system/managers/scopeManager';

//Helpers
import initAndRunScript from '../helpers/initAndRunScript';

//Helpers
const getElementById = async (config, script) => {
	const { source, sourceSelector } = config;
	const { ownerId } = script;

	let el;

	let selector = source ?? sourceSelector;
	if (selector.includes('||'))
		selector = getScopedId(selector, ownerId);

	if (source)
		el = document.getElementById(selector);
	else
		el = document.querySelector(selector);

	if (el) {
		const res = {
			el,
			selector
		};

		return res;
	}

	await new Promise(r => setTimeout(r, 100));

	return getElementById(config, script);
};

//Trigger

/* eslint-disable-next-line max-lines-per-function */
const onScrollComponent = async (config, props, script, context) => {
	const { debounceDelay = 80 } = config;

	const { el, mappedId } = await getElementById(config, script);

	let { sourceTop: previousY, sourceLeft: previousX } = el;
	let isScrolling;

	const intermediateHandler = () => {
		window.clearTimeout(isScrolling);

		isScrolling = setTimeout(() => {
			const { scrollLeft, scrollTop } = el;

			const scrollDeltaX = scrollLeft - previousX;
			const scrollDeltaY = scrollTop - previousY;

			initAndRunScript({
				script,
				props,
				context,
				setVariables: {
					scrollAxisX: scrollDeltaX !== 0,
					scrollAxisY: scrollDeltaY !== 0,
					scrollDeltaX,
					scrollDeltaY,
					scrollPositionX: scrollLeft,
					scrollPositionY: scrollTop,
					triggeredFrom: mappedId
				},
				isRootScript: true
			});

			previousX = scrollLeft;
			previousY = scrollTop;
		}, debounceDelay);
	};

	el.addEventListener('scroll', intermediateHandler, false);
	const unsub = () => el.removeEventListener('scroll', intermediateHandler);

	return [unsub];
};

export default onScrollComponent;
