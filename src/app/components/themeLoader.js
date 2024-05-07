//React
import { useContext, useEffect } from 'react';

//System
import { getMdaHelper, getMdaPackage } from '../../components/scriptRunner/actions/getMda/getMda';

//Config
import packageConfig from '../../packagePublic.json';
import { createContext } from '../../system/managers/appManager';
import { setTheme, finalizeThemes } from '../../system/managers/themeManager';
import config from '../../config';
import { applyPropSpecDefaults } from '../../system/managers/componentManager';

//Helpers
import applyThemesToMdaPackage from './helpers/applyThemesToMdaPackage';

//Context
const AppInnerContext = createContext('appInnerContext');

//Helpers
const applySystemThemeSettings = theme => {
	const { appTitle, appFaviconPath } = theme;

	if (appTitle)
		document.title = appTitle;

	if (appFaviconPath) {
		const favicon = document.getElementById('favicon');

		favicon.href = appFaviconPath;
	}
};

const setThemeOverrides = (themeName, theme) => {
	config.themeEntries.forEach(({ theme: overrideTheme, key, value }) => {
		if (overrideTheme !== themeName)
			return;

		theme[key] = value;
	});

	Object.entries(config).forEach(([k, v]) => {
		if (k.indexOf('themeEntry_') !== 0)
			return;

		const { theme: overrideTheme, key, value } = v;
		if (overrideTheme !== themeName)
			return;

		theme[key] = value;
	});
};

const loadAndSetTheme = (name, path) => {
	const theme = getMdaHelper({
		type: 'theme',
		key: path
	});

	if (name === 'system')
		theme.opusVersion = `${packageConfig.version}`;

	setThemeOverrides(name, theme);

	const mappedTheme = setTheme({ [name]: theme });

	if (name === 'system')
		applySystemThemeSettings(mappedTheme);
};

export const buildThemes = ({ themes, themeSets, theme: preferTheme }) => {
	for (let t of themes)
		loadAndSetTheme(t, t);

	const isDarkMode = (
		(
			window.matchMedia('(prefers-color-scheme: dark)').matches ||
			preferTheme === 'dark'
		) &&
		preferTheme !== 'light'
	);

	for (let { darkMode, themes: setThemes } of themeSets) {
		if (darkMode !== isDarkMode)
			continue;

		for (let { name, location } of setThemes)
			loadAndSetTheme(name, location);
	}

	finalizeThemes();
};

//Events
const onMount = props => {
	const { setState, themes, urlParsed, mdaPackageLoaded } = props;

	if (!themes || !urlParsed || !mdaPackageLoaded)
		return;

	buildThemes(props);

	const mdaPackage = getMdaPackage();

	//This has a side-effect. It modifies the mdaPackage in place
	applyThemesToMdaPackage(mdaPackage);

	applyPropSpecDefaults();

	setState({ themesLoaded: true });
};

//Components
const ThemeLoader = () => {
	const { getHandler, themes, urlParsed, mdaPackageLoaded } = useContext(AppInnerContext);

	useEffect(getHandler(onMount), [themes, urlParsed, mdaPackageLoaded]);

	return null;
};

//Exports
export default ThemeLoader;
