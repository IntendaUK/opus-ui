//System Helpers
import { clone } from '../../../system/helpers';

//Helpers
import initAndRunScript from '../helpers/initAndRunScript';

const morphIterateArray = async (
	{ id, value, chain, recordVarName = 'record', rowNumVarName = 'rowNum' }, script, props
) => {
	const clonedScript = clone({}, script);
	if (id !== undefined)
		clonedScript.id = id;

	if (clonedScript.trackAction) {
		//We track a temporary action to house these sub actions
		clonedScript.trackAction({ morphedConfig: { type: 'consume' } });
		clonedScript.trackSubActions();
	}

	let i = 0;

	for (let v of value) {
		await initAndRunScript({
			scriptId: id,
			script: clonedScript,
			scriptActions: chain,
			props,
			setVariables: {
				[recordVarName]: v,
				[rowNumVarName]: i
			}
		});

		i++;
	}

	if (clonedScript.trackAction)
		clonedScript.stopTrackingSubActions();
};

export default morphIterateArray;
