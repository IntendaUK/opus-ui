//System
import { AppContext } from '../../../system/managers/appManager';
import { getPropertyContainer } from '../../../system/managers/propertyManager';

//System Helpers
import { clone } from '../../../system/helpers';

//Actions
import { setVariables as setVariablesBase } from '../actions/variableActions';

//Helpers
import { runScript } from './runScript';
import getNextScriptId from './getNextScriptId';
import createVariableSnapshots from './createVariableSnapshots';

//Export
const initAndRunScript = async ({
	scriptId,
	script: originalScript,
	scriptActions,
	props,
	snapshotKeys,
	triggerMsg,
	setVariables,
	isRootScript = false
}) => {
	const context = AppContext;
	props = getPropertyContainer('SCRIPTRUNNER');

	let script = originalScript;

	if (scriptActions)
		script.actions = scriptActions;

	if (isRootScript) {
		script = clone({}, originalScript);
		if (scriptActions)
			script.actions = clone([], scriptActions);
	}

	script.id = scriptId ?? script.id ?? getNextScriptId();

	if (snapshotKeys && triggerMsg)
		createVariableSnapshots(props, script, snapshotKeys, triggerMsg);

	if (setVariables !== undefined)
		setVariablesBase({ variables: setVariables }, script, props);

	await runScript(context, props, script, script.actions, isRootScript);
};

export default initAndRunScript;
