//System Helpers
import { clone, getDeepPropertyArray, getDeepProperty } from '../helpers';

//Helpers
import buildStyleTag from './themeManager/buildStyleTag';

//Theme store
let setAppTheme = null;
let appTheme = null;

//External Helpers
import { defineFunction } from '../../components/scriptRunner/functions/functionManager';

//Exports
export const resolveThemeAccessor = (string, themes = appTheme) => {
	if (string === null || typeof(string) !== 'string' || !string.includes('theme.'))
		return string;

	let regexString = '{theme.(.*?)}';
	let regex = new RegExp(regexString, 'g');

	while (string?.includes && string.includes('{theme')) {
		const isDirectReplace = (
			string.split('{theme.').length === 2 &&
			string.indexOf('{theme.') === 0 &&
			string.indexOf('}') === string.length - 1
		);

		if (isDirectReplace) {
			let pathToValue = string.replace('{theme.', '');
			pathToValue = pathToValue.substr(0, pathToValue.length - 1);

			string = getDeepProperty(themes, pathToValue);
		} else {
			string = string.replace(regex, (match, token) => {
				return getDeepProperty(themes, token);
			});
		}
	}

	return string;
};

const recurseApplyThemes = (resultObj, obj, tempThemes) => {
	Object.entries(obj).forEach(([k, v]) => {
		if (Array.isArray(v)) {
			resultObj[k] = [];

			recurseApplyThemes(resultObj[k], v, tempThemes);
		} else if (typeof(v) === 'object' && v !== null) {
			resultObj[k] = {};

			recurseApplyThemes(resultObj[k], v, tempThemes);
		} else {
			const mappedV = resolveThemeAccessor(v, tempThemes);
			resultObj[k] = mappedV || v;
		}
	});
};

export const setTheme = newTheme => {
	const [ themeName, theme ] = Object.entries(newTheme)[0];

	const mappedTheme = {};
	const tempThemes = {
		[themeName]: mappedTheme,
		...appTheme
	};

	recurseApplyThemes(mappedTheme, theme, tempThemes);

	clone(appTheme, { [themeName]: mappedTheme });

	setAppTheme(appTheme);

	return mappedTheme;
};

export const init = (_setAppTheme, _appTheme) => {
	setAppTheme = _setAppTheme;
	appTheme = _appTheme;
};

export const getTheme = themeName => {
	return appTheme[themeName];
};

export const getThemes = () => {
	return appTheme;
};

//getThemeValue('themeName.key.subKey.subSubKey')
export const getThemeValue = accessor => {
	const path = accessor.split('.');

	const theme = appTheme[path[0]];
	path.splice(0, 1);

	return getDeepPropertyArray(theme, path);
};

export const finalizeTheme = themeName => {
	const theme = appTheme[themeName];

	const isFunctionTheme = theme?.themeConfig?.isFunctionTheme ?? false;
	if (isFunctionTheme) {
		Object.entries(theme).forEach(([k, v]) => {
			if (typeof(v) !== 'object' || v === null || k === 'themeConfig' || k === 'path')
				return;

			const { acceptArgs, fn, isModule } = v;

			defineFunction({
				name: k,
				acceptArgs,
				fn,
				isModule
			});
		});
	}

	const isStyleTheme = theme?.themeConfig?.isStyleTheme ?? true;
	if (!isStyleTheme)
		return;

	buildStyleTag(themeName, theme);
};

export const finalizeThemes = () => {
	Object.keys(appTheme).forEach(themeName => finalizeTheme(themeName));
};
