/* eslint-disable max-len */

//System Helpers
import { stateManager } from '../../../system/managers/stateManager';
import { getScopedId } from '../../../system/managers/scopeManager';
import { get as getSuite } from '../../../system/managers/suiteManager/store';
import { get as getSuiteData, set as setSuiteData } from '../../../system/managers/suiteManager/data';
import { markAsWrappedScriptHandler } from '../../../system/wrapper/wrapScriptHandlerInActions';

//Helper
const setupSuiteActions = ({ ownerId, script }) => {
	let { suite, method, args } = script.suite;

	if (typeof(script.suite) === 'string')
		[suite, method] = script.suite.split('.');

	script.suite = {
		suite,
		method
	};

	const suiteEntry = getSuite(script.suite);
	const boundHandler = suiteEntry.handler.bind(null, {
		ownerId,
		setState: stateManager.setWgtState.bind(null, ownerId),
		setExternalState: (idTarget, newState) => {
			if (idTarget.includes('||'))
				idTarget = getScopedId(idTarget, ownerId);

			stateManager.setWgtState(idTarget, newState, ownerId);
		},
		getState: stateManager.getWgtState.bind(null, ownerId),
		getExternalState: idSource => {
			if (idSource.includes('||'))
				idSource = getScopedId(idSource, ownerId);

			return stateManager.getWgtState(idSource);
		},
		getData: getSuiteData.bind(null, ownerId),
		setData: setSuiteData.bind(null, ownerId)
	});

	//Suites use the legacy positional handler signature (params via bind, then morphedConfig, script,
	// props). Mark the bound handler so processAction calls it directly rather than re-wrapping it in
	// the single-object vanilla-script convention, which would drop the { args }/ctx positional params.
	markAsWrappedScriptHandler(boundHandler);

	script.actions = [{
		handler: boundHandler,
		isAsync: suiteEntry.isAsync,
		args
	}];
};

export default setupSuiteActions;
