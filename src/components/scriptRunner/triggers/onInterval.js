//Helpers
import initAndRunScript from '../helpers/initAndRunScript';

//Trigger
const onInterval = (config, props, script, context) => {
	const handler = initAndRunScript.bind(null, {
		script,
		props,
		context,
		setVariables: { triggeredFrom: script.ownerId },
		isRootScript: true
	});

	const interval = setInterval(handler, config.delay);

	const unsub = () => clearInterval(interval);

	return [unsub];
};

export default onInterval;
