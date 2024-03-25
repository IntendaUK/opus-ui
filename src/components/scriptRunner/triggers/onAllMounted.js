//System Helpers
import { subscribe } from '../../../system/managers/flowManager/index';
import { getScopedId, isIdInDom } from '../../../system/managers/scopeManager';

//Helpers
import initAndRunScript from '../helpers/initAndRunScript';

//Trigger
const onAllMounted = async (config, props, script, context) => {
	const { sourceList } = config;
	const { ownerId } = script;

	const unsubs = [];

	//Build an array of promises to wait for all unmounted components to mount
	const promises = sourceList
		.filter(s => {
			let useId = s;

			if (s.includes('||')) {
				useId = getScopedId(s, ownerId);

				if (useId.includes('||'))
					return true;
			}

			const isMounted = isIdInDom(useId);

			return !isMounted;
		})
		.map(s => {
			return new Promise(res => {
				const unsub = subscribe(s, ownerId, res, 'onMount');

				unsubs.push(unsub);
			});
		});

	(async () => {
		await Promise.all(promises);

		initAndRunScript({
			script,
			props,
			context,
			isRootScript: true
		});
	})();

	return unsubs;
};

export default onAllMounted;
