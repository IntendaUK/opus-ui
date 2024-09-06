//System
import { getDom } from '../../../system/managers/scopeManager';

//Action
const getComponentAtPosition = ({ x, y }) => {
	const dom = getDom();

	const res = [];

	document
		.elementsFromPoint(x, y)
		.forEach(e => {
			if (e.classList.contains('popoverRef'))
				return;

			if (dom.some(d => d.id === e.id))
				res.push(e.id);
		});

	return res;
};

export default getComponentAtPosition;
