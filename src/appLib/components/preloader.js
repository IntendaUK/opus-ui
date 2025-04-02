//React
import { useEffect, useContext } from 'react';

//System
import { init as initEventManager } from '../../system/managers/eventManager';
import { createContext } from '../../system/managers/appManager';
import * as componentManager from '../../system/managers/componentManager';
import { generateKeyLookup } from '../../system/managers/localStorageManager/keyLookupCache';
import opusConfig from '../../config';

//Helpers
import loadThemes from '../helpers/loadThemes';
import bindDevtools from './helpers/bindDevtools';

//Config
import defaultThemesConfig from './preloader/defaultThemesConfig';

//Context
const AppInnerContext = createContext('appInnerContext');

//Events
const onMount = (props, appProps) => {
	const {
		themesConfig: themesConfigOverride,
		registerComponentTypes,
		externalComponentTypes
	} = appProps;

	const { init: initComponentManager, registerExternalTypes } = componentManager;

	initComponentManager();

	const themesConfig = defaultThemesConfig;

	if (themesConfigOverride?.themes) {
		Object.entries(themesConfigOverride.themes).forEach(([k, v]) => {
			themesConfig.themes[k] = v;
		});
	}

	if (registerComponentTypes)
		registerExternalTypes(registerComponentTypes);

	if (externalComponentTypes)
		registerExternalTypes(externalComponentTypes);

	loadThemes(themesConfig);

	generateKeyLookup();
	initEventManager();

	componentManager.applyPropSpecDefaults();

	if (opusConfig.env === 'development' && window._OPUS_DEVTOOLS_GLOBAL_HOOK)
		bindDevtools();

	props.setState({ preloadCompleted: true });
};

//Components
export const Preloader = ({ appProps }) => {
	const { getHandler } = useContext(AppInnerContext);

	useEffect(getHandler(onMount, appProps), []);

	return null;
};

//Exports
export default Preloader;
