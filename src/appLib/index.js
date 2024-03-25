//React
import React, { useEffect, useState, useContext } from 'react';

//Fonts
import 'typeface-roboto';

//Styles
import '../styles/main.css';
import '../styles/mobile.css';

//Polyfills
import '../system/polyfills';

//System
import { AppContext, appManager, createContext } from '../system/managers/appManager';
import { init as initThemeManager } from '../system/managers/themeManager';
import { overrideConfig } from '../config';

//Components
import Preloader from './components/preloader';
import SystemComponents from './components/systemComponents';
import Dashboard from './components/dashboard';

//Context
const AppInnerContext = createContext('appInnerContext');

//Events
const onMount = (state, setState, theme, setTheme, appProps) => {
	if (appProps.options)
		overrideConfig(appProps.options);

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
	1 			Preloader
	3			SystemComponents
	4			Dashboard
*/
const AppInner = ({ appProps }) => {
	const { setState } = useContext(AppInnerContext);

	if (!setState)
		return null;

	return (
		<>
			<Preloader appProps={appProps} />
			<SystemComponents />
			<Dashboard appProps={appProps} />
		</>
	);
};

export const AppLib = props => {
	const [state, set] = useState({ ...props });
	const [theme, setTheme] = useState({});

	useEffect(onMount.bind(null, state, set, theme, setTheme, props), []);

	const { managerInstance } = state;

	const className = window.isMobile ? 'mobile' : '';

	const getHandler = (fn, ...rest) => fn.bind(null, state, ...rest);

	return (
		<AppContext.Provider className={className} value={managerInstance}>
			<AppInnerContext.Provider value={{
				...state,
				getHandler
			}}>
				<AppInner appProps={props} />
			</AppInnerContext.Provider>
		</AppContext.Provider>
	);
};
