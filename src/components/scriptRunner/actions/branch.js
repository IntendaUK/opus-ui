//Helpers
import initAndRunScript from '../helpers/initAndRunScript';

const branch = async (
	{ branches, rowNumberVarName = 'rowNumber' }, script, props
) => {
	if (script.trackAction) {
		//We track a temporary action to house these sub actions
		script.trackAction({ morphedConfig: { type: 'consume' } });
		script.trackSubActions();
	}

	await Promise.all(branches.map((config, i) => {
		const { id = script.id, actions } = config;

		return initAndRunScript({
			scriptId: id,
			script,
			scriptActions: actions,
			props,
			setVariables: { [rowNumberVarName]: i }
		});
	}));

	if (script.trackAction)
		script.stopTrackingSubActions();
};

export default branch;
