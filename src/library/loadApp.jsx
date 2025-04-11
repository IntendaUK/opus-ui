//React
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

//Opus
import { AppContext, appManager, createContext } from '../system/managers/appManager';
import SystemComponents from '../appLib/components/systemComponents';
import { Wrapper } from '../system/wrapper/wrapper';
import { buildThemes } from '../app/components/themeLoader';
import { init as initComponentManager,
	registerExternalTypes,
	applyPropSpecDefaults } from '../system/managers/componentManager';
import { init as initEventManager } from '../system/managers/eventManager';
import { setMdaPackage, getMdaHelper, getMdaPackage } from '../components/scriptRunner/actions/getMda/getMda';
import createFlow from '../components/scriptRunner/actions/createFlow';
import { init as initThemeManager } from '../system/managers/themeManager';
import applyThemesToMdaPackage from '../app/components/helpers/applyThemesToMdaPackage';
import { getExternalComponentTypes } from './externalComponentTypes';
import { overrideConfig, default as opusConfig } from '../config';
import bindDevtools from '../appLib/components/helpers/bindDevtools';
import { setOpusHelpersInWindow } from '../system/helpers';

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
const onMount = (
	state, set, theme, setTheme, mdaPackage, shouldLoadUrlParameters, config, startupDashboardPath, windowHelpers
) => {
	if (windowHelpers !== undefined) {
		//Make required helper methods available through window._.spliceWhere, etc.
		setOpusHelpersInWindow(windowHelpers);
	}

	overrideConfig(config);

	const managerInstance = appManager();
	managerInstance.initState('app', set, state);

	initThemeManager(setTheme, theme);
	initComponentManager();
	initEventManager();

	registerExternalTypes(getExternalComponentTypes());

	setMdaPackage(mdaPackage);

	let { startup, themes, themeSets = [] } = getMdaHelper({
		type: 'dashboard',
		key: 'index'
	});

	if (startupDashboardPath)
		startup = startupDashboardPath;

	if (shouldLoadUrlParameters) {
		const urlParams = Object.fromEntries(new URLSearchParams(window.location.search));

		theme = urlParams.theme ?? theme;
		startup = urlParams.dashboard ?? startup;

		const flowObjects = buildFlowObjects(urlParams.states);

		//The last argument should be a props object, since we use that to obtain 'getWgtState',
		// but this is only used when no value is specified for a flow (which is not the case here)
		flowObjects.forEach(flowObject => {
			createFlow(flowObject, { ownerId: 'app' }, { getWgtState: () => {} });
		});
	}

	buildThemes({
		themes,
		themeSets,
		theme
	});

	//We need to load it again because the setMdaPackage function clones the contents of the package into an existing object
	const finalMdaPackage = getMdaPackage();

	applyThemesToMdaPackage(finalMdaPackage);
	applyPropSpecDefaults();

	if (opusConfig.env === 'development' && window._OPUS_DEVTOOLS_GLOBAL_HOOK)
		bindDevtools();

	const startupDashboard = getMdaHelper({
		type: 'dashboard',
		key: startup
	});

	set({
		managerInstance,
		startupDashboard
	});
};

//Components
const OpusApp = ({ mdaPackage, loadUrlParameters, config, startupDashboardPath, windowHelpers }) => {
	const [state, set] = useState({ });
	const [theme, setTheme] = useState({});

	const { managerInstance } = state;

	useEffect(
		onMount.bind(null, state, set, theme, setTheme, mdaPackage, loadUrlParameters, config, startupDashboardPath, windowHelpers),
		[]
	);

	const { startupDashboard } = state;

	let inner;

	if (startupDashboard) {
		inner = (
			<>
				<SystemComponents />
				<Wrapper key={startupDashboard.id} mda={startupDashboard} />
			</>
		);
	}

	return (
		<AppContext.Provider value={managerInstance}>
			<AppInnerContext.Provider value={{ ...state }}>
				{inner}
			</AppInnerContext.Provider>
		</AppContext.Provider>
	);
};

//Export
const loadApp = async ({
	mdaPackage,
	loadUrlParameters = false,
	config = {},
	renderFunction,
	startupDashboardPath,
	windowHelpers
}) => {
	const Component = (
		<OpusApp
			mdaPackage={mdaPackage}
			loadUrlParameters={loadUrlParameters}
			config={config}
			startupDashboardPath={startupDashboardPath}
			windowHelpers={windowHelpers}
		/>
	);

	if (!renderFunction) {
		const rootEl = document.getElementById('root');
		const root = createRoot(rootEl);

		root.render(Component);
	} else
		return renderFunction(Component);
};

export default loadApp;
