//Helpers
import initAndRunScript from '../helpers/initAndRunScript';

//Trigger
const onConnectionRestored = (config, props, script) => {
	const handler = initAndRunScript.bind(null, {
		script,
		props,
		isRootScript: true
	});

	window.addEventListener('online', handler);

	const unsub = () => window.removeEventListener('online', handler);

	return [unsub];
};

export default onConnectionRestored;
