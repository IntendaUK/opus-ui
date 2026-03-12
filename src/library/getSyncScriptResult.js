import { getPropertyContainer } from '../system/managers/propertyManager';
import { runScriptSync } from '../components/scriptRunner/helpers/runScript';
import { getVariable } from '../components/scriptRunner/actions/variableActions';
import getNextScriptId from '../components/scriptRunner/helpers/getNextScriptId';

const getSyncScriptResult = script => {
	if (script.morphId === undefined)
		script.id = getNextScriptId();
	else
		script.id = script.morphId;

	const { id, morphVariable, morphActions } = script;

	const srProps = getPropertyContainer('SCRIPTRUNNER');

	runScriptSync(srProps, script, morphActions);

	const result = getVariable({
		id,
		name: morphVariable
	}, script, srProps);

	return result;
};

export default getSyncScriptResult;
