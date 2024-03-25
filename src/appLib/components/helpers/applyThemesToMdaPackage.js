//System Helpers
import { resolveThemeAccessor } from '../../../system/managers/themeManager';

//Helper
const applyThemesToMdaPackage = mda => {
	Object.entries(mda).forEach(([k, v]) => {
		const typeV = typeof v;
		if (v !== null && typeV === 'object')
			applyThemesToMdaPackage(v);
		else if (typeV === 'string' && v.includes('{theme.'))
			mda[k] = resolveThemeAccessor(v);
	});
};

export default applyThemesToMdaPackage;
