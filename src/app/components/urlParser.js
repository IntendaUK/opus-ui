//React
import { useEffect, useContext } from 'react';

//System
import createFlow from '../../components/scriptRunner/actions/createFlow';
import { createContext } from '../../system/managers/appManager';

//Context
const AppInnerContext = createContext('appInnerContext');

//Helpers
const buildStateFromStringList = statesStringList => {
	const statesMappingObj = {};

	statesStringList.forEach(stateString => {
		const [path, value] = stateString.split('=');
		const propKeys = path.split('.');
		const keysLength = propKeys.length;

		let obj = statesMappingObj;

		propKeys.forEach((key, i) => {
			key = key.trim();
			const isLastKey = i + 1 === keysLength;

			if (isLastKey) {
				obj[key] = value;

				return;
			}

			if (!obj[key])
				obj[key] = {};

			obj = obj[key];
		});
	});

	return statesMappingObj;
};

const buildFlowObjects = statesString => {
	const flowObjects = [];

	if (!statesString)
		return flowObjects;

	const statesStringList = statesString.split(',');
	const statesMappingObj = buildStateFromStringList(statesStringList);

	Object.entries(statesMappingObj).forEach(([to, state]) => {
		Object.entries(state).forEach(([toKey, value]) => {
			flowObjects.push({
				to,
				toKey,
				value
			});
		});
	});

	return flowObjects;
};

//Events
const onParseUrl = ({ setState, startupJsonLoaded }) => {
	if (!startupJsonLoaded)
		return;

	const urlParams = Object.fromEntries(new URLSearchParams(window.location.search));

	const newState = { urlParsed: true };

	['dashboard', 'dashboardUri', 'theme'].forEach(p => {
		if (urlParams[p])
			newState[p] = urlParams[p];
	});

	const flowObjects = buildFlowObjects(urlParams.states);

	//The last argument should be a props object, since we use that to obtain 'getWgtState',
	// but this is only used when no value is specified for a flow (which is not the case here)
	flowObjects.forEach(flowObject => {
		createFlow(flowObject, { ownerId: 'app' }, { getWgtState: () => {} });
	});

	setState(newState);
};

//Components
const UrlParser = () => {
	const { getHandler, startupJsonLoaded } = useContext(AppInnerContext);

	useEffect(getHandler(onParseUrl), [startupJsonLoaded]);

	return null;
};

//Exports
export default UrlParser;
