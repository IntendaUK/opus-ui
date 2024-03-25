//System
import { getDom } from '../../../system/managers/scopeManager';

//Action
const getComponentAtPosition = ({ x, y }) => {
	const dom = getDom();

	const res = [];

	document
		.elementsFromPoint(x, y)
		.forEach(e => {
			const useId = e.classList.contains('popoverRef') ? e.parentNode.id : e.id;

			if (dom.some(d => d.id === useId))
				res.push(useId);
		});

	return res;
};

export default getComponentAtPosition;
