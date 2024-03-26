//System Helpers
import { buildStyleTag } from '../../../system/wrapper/helpers/styleTags';
import { generateGuid } from '../../../system/helpers';

//Action
const registerStylesheet = ({ stylesheet }) => {
	const el = buildStyleTag(generateGuid(), '', stylesheet);

	return el.id;
};

export default registerStylesheet;
