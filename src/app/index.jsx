//React
import React, { useEffect, useState, useContext } from 'react';

//Fonts
//Styles
import '../styles/main.css';
import '../styles/mobile.css';

//Polyfills
import '../system/polyfills';

//System
import { AppContext, appManager, createContext } from '../system/managers/appManager';
import { init as initThemeManager } from '../system/managers/themeManager';
import { setOpusHelpersInWindow } from '../system/helpers';

//Components
import Preloader from './components/preloader';
import PackageLoader from './components/packageLoader';
import UrlParser from './components/urlParser';
import ThemeLoader from './components/themeLoader';
import PreloadMda from './components/preloadMda';
import FontLoader from './components/fontLoader';
import SystemComponents from './components/systemComponents';
import DashboardLoader from './components/dashboardLoader';
import Dashboard from './components/dashboard';

//Context
const AppInnerContext = createContext('appInnerContext');

//Events
const onMount = (state, setState, theme, setTheme) => {
	//Make all helper methods available through window._.spliceWhere, etc.
	setOpusHelpersInWindow({ includeAll: true });

	const managerInstance = appManager();
	managerInstance.initState('app', setState, state);

	initThemeManager(setTheme, theme);

	const { setWgtState } = managerInstance;
	const setAppState = setWgtState.bind(null, 'app');

	setState({
		...state,
		setWgtState,
		setState: setAppState,
		managerInstance
	});
};

/*
	ORDER		COMPONENT 			SETS STATES
	1			PackageLoader		mdaPackageLoaded
	2 			Preloader			startupJsonLoaded
									dashboard
									themes
	3 			UrlParser			urlParsed
	4			ThemeLoader			themesLoaded
	5			PreloadMda			mdaPreloaded
	5			FontLoader			fontsLoaded
	6			DashboardLoader		dashboardMda
	6			SystemComponents	propSpecsLoaded
	7			Dashboard
*/
const AppInner = () => {
	const { setState, mdaPackageLoaded } = useContext(AppInnerContext);

	if (!setState)
		return null;

	if (!mdaPackageLoaded)
		return <PackageLoader />;

	return (
		<>
			<Preloader />
			<UrlParser />
			<ThemeLoader />
			<PreloadMda />
			<FontLoader />
			<DashboardLoader />
			<SystemComponents />
			<Dashboard />
		</>
	);
};

export const App = props => {
	const [state, set] = useState({ ...props });
	const [theme, setTheme] = useState({});

	useEffect(onMount.bind(null, state, set, theme, setTheme), []);

	const { managerInstance } = state;

	const className = window.isMobile ? 'mobile' : '';

	const getHandler = (fn, ...rest) => fn.bind(null, state, ...rest);

	return (
		<AppContext.Provider className={className} value={managerInstance}>
			<AppInnerContext.Provider value={{
				...state,
				getHandler
			}}>
				<AppInner />
			</AppInnerContext.Provider>
		</AppContext.Provider>
	);
};
