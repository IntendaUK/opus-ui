//Helpers
import initAndRunScript from '../helpers/initAndRunScript';

//Trigger
const onConnectionRestored = (config, props, script, context) => {
	const handler = initAndRunScript.bind(null, {
		script,
		props,
		context,
		isRootScript: true
	});

	window.addEventListener('online', handler);

	const unsub = () => window.removeEventListener('online', handler);

	return [unsub];
};

export default onConnectionRestored;
