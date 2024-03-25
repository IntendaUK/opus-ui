//React
import { useEffect, useContext } from 'react';

//System
import { getThemes } from '../../system/managers/themeManager';
import { applyTraits } from '../../system/managers/traitManager';
import { setTrait } from '../../system/managers/traitManager/getTrait';
import { applyBlueprints, setBlueprint } from '../../system/managers/blueprintManager';
import { AppContext, createContext } from '../../system/managers/appManager';
import { getMdaHelper } from '../../components/scriptRunner/actions/getMda/getMda';

//Context
const AppInnerContext = createContext('appInnerContext');

//Helpers
const preloadTraitsRecursively = async (mda, appContext) => {
	if (mda.traits)
		await applyTraits(mda, appContext);

	for (const v of Object.values(mda)) {
		if (typeof(v) === 'object' && v !== null)
			await preloadTraitsRecursively(v, appContext);
	}
};

const performPreload = async (path, appContext) => {
	const splitPath = path.split('/');
	const [ type ] = splitPath.splice(0, 1);

	const key = splitPath.join('/');

	const mda = await getMdaHelper({
		type,
		key
	});

	if (!mda) {
		/* eslint-disable-next-line no-console */
		console.log('PRELOAD MDA FAILED: ', key);

		return;
	}

	const isTrait = mda.acceptPrps && type === 'dashboard';
	const isBlueprint = mda.acceptPrps && type === 'blueprint';

	if (isTrait) {
		setTrait(key, mda);

		const fakeMda = { traits: [ key ] };

		await preloadTraitsRecursively(fakeMda, appContext);
	} else if (isBlueprint) {
		setBlueprint(key, mda);

		const fakeMda = {
			blueprint: key,
			blueprintPrps: {}
		};

		await applyBlueprints(fakeMda, '');
	}
};

//Events
const onThemesSet = ({ setState, themesLoaded }, appContext) => {
	if (!themesLoaded)
		return;

	(async () => {
		const promises = [];

		const themes = Object.values(getThemes());
		themes.forEach(t => {
			const { themeConfig, preload } = t;

			if (!themeConfig?.isPreloadTheme || !preload)
				return;

			preload.forEach(p => {
				promises.push(performPreload(p, appContext));
			});
		});

		await Promise.all(promises);

		setState({ mdaPreloaded: true });
	})();
};

//Components
export const PreloadMda = () => {
	const { getHandler, themesLoaded } = useContext(AppInnerContext);
	const appContext = useContext(AppContext);

	useEffect(getHandler(onThemesSet, appContext), [themesLoaded]);

	return null;
};

//Exports
export default PreloadMda;
