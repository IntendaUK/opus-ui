/* eslint-disable max-lines-per-function */

//System
import { getPropertyContainer } from '../../../system/managers/propertyManager';
import { hasSourceActions, hydrateSourceActions } from '../../../system/wrapper/sourceActionHelpers';
import { isWrappedScriptHandler, wrapScriptHandlerInActions } from '../../../system/wrapper/wrapScriptHandlerInActions';

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

	//Converted scripts hydrate in parallel with trigger registration — make sure
	// the handler module has landed before running (no-op after the first run).
	if (script.__hydration)
		await script.__hydration;

	if (script.handler) {
		//Already-wrapped handlers are used as-is — re-wrapping breaks the
		// (morphedConfig, script, props) call contract.
		script.actions = isWrappedScriptHandler(script.handler)
			? [{ handler: script.handler }]
			: wrapScriptHandlerInActions({
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

	if (isRootScript && hasSourceActions(script)) {
		await hydrateSourceActions({
			script,
			ownerId: script.ownerId
		});
	}

	script.id = scriptId ?? script.id ?? getNextScriptId();

	if (snapshotKeys && triggerMsg)
		createVariableSnapshots(props, script, snapshotKeys, triggerMsg);

	if (setVariables !== undefined)
		setVariablesBase({ variables: setVariables }, script, props);

	await runScript(props, script, script.actions, isRootScript);
};

export default initAndRunScript;
