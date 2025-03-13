//Helpers
import initAndRunScript from '../helpers/initAndRunScript';

//Throttling
const delay = 250;

//Trigger
const onWindowResized = (config, props, script) => {
	config.throttled = false;
	config.delay = delay;

	const intermediateHandler = () => {
		if (config.throttled)
			return;

		initAndRunScript({
			script,
			props,
			isRootScript: true
		});

		config.throttled = true;

		setTimeout(() => {
			config.throttled = false;
		}, delay);
	};

	window.addEventListener('resize', intermediateHandler);

	const unsub = () => window.removeEventListener('resize', intermediateHandler);

	return [unsub];
};

export default onWindowResized;
