//System Helpers
import { subscribe } from '../../../system/managers/flowManager/index';

//Helpers
import initAndRunScript from '../helpers/initAndRunScript';

//Trigger
const onUnmount = (config, props, script, context) => {
	const { source = script.ownerId, snapshotKeys } = config;

	const unsub = subscribe(source, script.ownerId, msg => {
		initAndRunScript({
			script,
			props,
			context,
			snapshotKeys,
			triggerMsg: msg,
			setVariables: { triggeredFrom: msg.full.id },
			isRootScript: true
		});
	}, 'onUnmount');

	return [unsub];
};

export default onUnmount;
