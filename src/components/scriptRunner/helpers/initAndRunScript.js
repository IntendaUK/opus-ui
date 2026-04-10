/* eslint-disable max-lines-per-function */

//System
import { getPropertyContainer } from '../../../system/managers/propertyManager';
import { wrapScriptHandlerInActions } from '../../../system/wrapper/wrapperExternal';

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
	props = getPropertyContainer('SCRIPTRUNNER');

	let script = originalScript;

	if (script.handler) {
		script.actions = wrapScriptHandlerInActions({
			script,
			ownerId: script.ownerId,
			handler: script.handler
		});
	} else {
		if (scriptActions)
			script.actions = scriptActions;

		if (isRootScript) {
			script = clone({}, originalScript);
			if (scriptActions)
				script.actions = clone([], scriptActions);
		}
	}

	script.id = scriptId ?? script.id ?? getNextScriptId();

	if (snapshotKeys && triggerMsg)
		createVariableSnapshots(props, script, snapshotKeys, triggerMsg);

	if (setVariables !== undefined)
		setVariablesBase({ variables: setVariables }, script, props);

	await runScript(props, script, script.actions, isRootScript);
};

export default initAndRunScript;
