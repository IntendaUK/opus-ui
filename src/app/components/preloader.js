//React
import { useEffect, useContext } from 'react';

//System
import { init as initEventManager } from '../../system/managers/eventManager';
import { createContext } from '../../system/managers/appManager';
import { getMdaHelper } from '../../components/scriptRunner/actions/getMda/getMda';
import { generateKeyLookup } from '../../system/managers/localStorageManager/keyLookupCache';

//Context
const AppInnerContext = createContext('appInnerContext');

//Events
const onMount = () => {
	generateKeyLookup();
	initEventManager();
};

const onLoadStartupJson = ({ setState, dashboard }) => {
	(async () => {
		const { startup, themes, themeSets = [] } = await getMdaHelper({
			type: 'dashboard',
			key: 'index'
		});

		const newState = {
			themes,
			themeSets,
			startupJsonLoaded: true
		};

		if (!dashboard)
			newState.dashboard = startup;

		setState(newState);
	})();
};

//Components
export const Preloader = () => {
	const { getHandler } = useContext(AppInnerContext);

	useEffect(getHandler(onMount), []);
	useEffect(getHandler(onLoadStartupJson), []);

	return null;
};

//Exports
export default Preloader;
