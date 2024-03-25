//System Helpers
import { applyBlueprints } from '../../../system/managers/blueprintManager';

//Helpers
import { runScript } from './runScript';
import spreadActions from './spreadActions';

//Helper
const runBlueprintScript = async (context, props, script) => {
	await applyBlueprints(script);

	const { actions } = script;

	spreadActions(script, actions, props);

	runScript(context, props, script, actions);
};

export default runBlueprintScript;
