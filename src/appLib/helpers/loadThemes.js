import { setTheme, finalizeThemes } from '../../system/managers/themeManager';

const applySystemThemeSettings = theme => {
	const { appTitle, appFaviconPath } = theme;

	if (appTitle)
		document.title = appTitle;

	if (appFaviconPath) {
		const favicon = document.getElementById('favicon');

		favicon.href = appFaviconPath;
	}
};

const loadAndSetTheme = (name, theme) => {
	const mappedTheme = setTheme({ [name]: theme });

	if (name === 'system')
		applySystemThemeSettings(mappedTheme);
};

const loadThemes = (themesConfig = {}) => {
	const { themes = {}, themeSets = [], theme: preferTheme } = themesConfig;

	Object.entries(themes).forEach(([themeName, theme]) => {
		loadAndSetTheme(themeName, theme);
	});

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

export default loadThemes;
