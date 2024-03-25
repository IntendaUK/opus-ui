//System Helpers
import { getDeepProperty } from '../../../system/helpers';

const deleteKeys = ({ value, paths }) => {
	paths.forEach(p => {
		const split = p.split('.');
		const last = split.pop();

		const obj = getDeepProperty(value, split.join('.'));
		if (!obj)
			return;

		delete obj[last];
	});
};

export default deleteKeys;
