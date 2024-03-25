//React
import { useEffect, useContext } from 'react';

//System
import { createContext } from '../../system/managers/appManager';
import { getTheme } from '../../system/managers/themeManager';

//Context
const AppInnerContext = createContext('appInnerContext');

//Events
const onMount = ({ setState, themesLoaded }) => {
	if (!themesLoaded)
		return;

	const { fontFamily, fontPath } = getTheme('global');

	if (!fontPath) {
		setState({ fontsLoaded: true });

		return;
	}

	const fontFace = new FontFace(fontFamily, `url(${fontPath})`);

	(async () => {
		await fontFace.load();
		document.fonts.add(fontFace);

		setState({ fontsLoaded: true });
	})();
};

//Components
const FontLoader = () => {
	const { getHandler, themesLoaded } = useContext(AppInnerContext);

	useEffect(getHandler(onMount), [themesLoaded]);

	return null;
};

export default FontLoader;
