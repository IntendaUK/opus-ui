/* eslint-disable max-len */

//System Helpers
import { stateManager } from '../../../system/managers/stateManager';
import { get as getSuite } from '../../../system/managers/suiteManager/store';
import { get as getSuiteData, set as setSuiteData } from '../../../system/managers/suiteManager/data';

//Helper
const setupSuiteActions = ({ ownerId, script }) => {
	let { suite, method } = script.suite;

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
		setExternalState: stateManager.setWgtState,
		getState: stateManager.getWgtState.bind(null, ownerId),
		getExternalState: stateManager.getWgtState,
		getData: getSuiteData.bind(null, ownerId),
		setData: setSuiteData.bind(null, ownerId)
	});

	script.actions = [{
		handler: boundHandler,
		isAsync: suiteEntry.isAsync
	}];
};

export default setupSuiteActions;
