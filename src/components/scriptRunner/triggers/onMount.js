//System Helpers
import { subscribe } from '../../../system/managers/flowManager/index';

//Helpers
import initAndRunScript from '../helpers/initAndRunScript';

//Trigger
const onMount = (config, props, script, context) => {
	const { source = script.ownerId, sourceList, snapshotKeys } = config;

	const sourceIds = sourceList ?? [ source ];

	const unsubs = sourceIds.map(s => {
		const unsub = subscribe(s, script.ownerId, msg => {
			initAndRunScript({
				script,
				props,
				context,
				snapshotKeys,
				triggerMsg: msg,
				setVariables: { triggeredFrom: msg.full.id },
				isRootScript: true
			});
		}, 'onMount');

		return unsub;
	}).flat();

	return unsubs;
};

export default onMount;
