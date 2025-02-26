//Helpers
import initAndRunScript from '../helpers/initAndRunScript';

//Trigger
const onConnectionLost = (config, props, script) => {
	const handler = initAndRunScript.bind(null, {
		script,
		props,
		isRootScript: true
	});

	window.addEventListener('offline', handler);

	const unsub = () => window.removeEventListener('offline', handler);

	return [unsub];
};

export default onConnectionLost;
