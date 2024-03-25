//System Helpers
import { getTheme as getThemeSystem } from '../../../system/managers/themeManager';

const getTheme = ({ name }) => {
	const theme = getThemeSystem(name);

	return theme;
};

export default getTheme;
