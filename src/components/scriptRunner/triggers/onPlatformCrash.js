//Helpers
import initAndRunScript from '../helpers/initAndRunScript';

//Trigger
const onPlatformCrash = (config, props, script) => {
	const handler = e => {
		initAndRunScript({
			script,
			props,
			setVariables: {
				error: e.error.message,
				stackTrace: e.error.stack
			},
			isRootScript: true
		});
	};

	window.addEventListener('error', handler);

	const unsub = () => window.removeEventListener('error', handler);

	return [unsub];
};

export default onPlatformCrash;
