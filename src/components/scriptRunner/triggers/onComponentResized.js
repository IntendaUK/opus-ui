//System Helpers
import { getScopedId } from '../../../system/managers/scopeManager';

//Helpers
import initAndRunScript from '../helpers/initAndRunScript';

const getElementById = async ({ source, sourceSelector, scriptOwnerId }) => {
	if (source && source.includes('||'))
		source = getScopedId(source, scriptOwnerId);

	if (sourceSelector && sourceSelector.includes('||'))
		sourceSelector = getScopedId(sourceSelector, scriptOwnerId);

	let el;
	if (sourceSelector)
		el = document.querySelector(sourceSelector);
	else if (source)
		el = document.getElementById(source);

	if (el) {
		const res = {
			el,
			mappedId: el.id
		};

		return res;
	}

	await new Promise(r => setTimeout(r, 100));

	return getElementById({
		source,
		sourceSelector,
		scriptOwnerId
	});
};

//Trigger
const onComponentResized = async (config, props, script) => {
	const { source = script.ownerId, sourceSelector } = config;

	const { el, mappedId } = await getElementById({
		source,
		sourceSelector,
		scriptOwnerId: script.ownerId
	});

	const handler = initAndRunScript.bind(null, {
		script,
		props,
		setVariables: { triggeredFrom: mappedId },
		isRootScript: true
	});

	const observer = new ResizeObserver(handler);
	observer.observe(el);

	const unsub = () => observer.disconnect();

	return [unsub];
};

export default onComponentResized;
