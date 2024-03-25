//System Helpers
import { clone } from '../../../system/helpers';

//Helpers
import initAndRunScript from '../helpers/initAndRunScript';
import { shouldExitLoop } from './exitLoop';

const forLoop = async (
	{ id, loopId, count, actions, rowNumberVarName = 'rowNumber' }, script, props, context
) => {
	const clonedScript = clone({}, script);
	if (id !== undefined)
		clonedScript.id = id;

	if (clonedScript.trackAction) {
		//We track a temporary action to house these sub actions
		clonedScript.trackAction({ morphedConfig: { type: 'consume' } });
		clonedScript.trackSubActions();
	}

	for (let i = 0; i < count; i++) {
		await initAndRunScript({
			scriptId: id,
			script: clonedScript,
			scriptActions: actions,
			props,
			context,
			setVariables: { [rowNumberVarName]: i }
		});
		const exit = shouldExitLoop(loopId);
		if (exit)
			break;
	}

	if (clonedScript.trackAction)
		clonedScript.stopTrackingSubActions();
};

export default forLoop;
