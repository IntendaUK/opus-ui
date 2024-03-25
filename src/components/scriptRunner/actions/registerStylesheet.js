//System Helpers
import { buildStyleTag } from '../../../system/wrapper/helpers/styleTags';
import { getThemes } from '../../../system/managers/themeManager';
import { generateGuid } from '../../../system/helpers';

//Action
const registerStylesheet = ({ stylesheet }) => {
	const el = buildStyleTag(generateGuid(), '', stylesheet, getThemes());

	return el.id;
};

export default registerStylesheet;
