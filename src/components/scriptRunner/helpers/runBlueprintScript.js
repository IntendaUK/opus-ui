//System Helpers
import { applyBlueprints } from '../../../system/managers/blueprintManager';

//Helpers
import { runScript } from './runScript';
import spreadActions from './spreadActions';

//Helper
const runBlueprintScript = async (props, script) => {
	applyBlueprints(script);

	const { actions } = script;

	spreadActions(script, actions, props);

	await runScript(props, script, actions);
};

export default runBlueprintScript;
