//System Helpers
import { getScopedId } from '../../../system/managers/scopeManager';

//Helpers
import initAndRunScript from '../helpers/initAndRunScript';

const getElementById = async (id, scriptOwnerId) => {
	const mappedId = id.includes('||') ? getScopedId(id, scriptOwnerId) : id;

	const el = document.getElementById(mappedId);
	if (el) {
		const res = {
			el,
			mappedId
		};

		return res;
	}

	await new Promise(r => setTimeout(r, 100));

	return getElementById(id, scriptOwnerId);
};

//Trigger
const onComponentResized = async (config, props, script, context) => {
	const { source = script.ownerId } = config;

	const { el, mappedId } = await getElementById(source, script.ownerId);

	const handler = initAndRunScript.bind(null, {
		script,
		props,
		context,
		setVariables: { triggeredFrom: mappedId },
		isRootScript: true
	});

	const observer = new ResizeObserver(handler);
	observer.observe(el);

	const unsub = () => observer.disconnect();

	return [unsub];
};

export default onComponentResized;
