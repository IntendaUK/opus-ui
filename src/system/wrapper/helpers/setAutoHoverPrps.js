//System Helpers
import { getDeepProperty } from '../../helpers';

const recurseProps = (rootProps, object, pathArray = []) => {
	const propertyPath = pathArray.join('.');

	Object.entries(object).forEach(([k, v]) => {
		if (typeof(v) === 'object' && !!v) {
			const nextPathArray = [...pathArray, k];

			recurseProps(rootProps, v, nextPathArray);

			return;
		}

		if (v === '((auto))') {
			const rootValue = getDeepProperty(rootProps, propertyPath)?.[k];
			if (rootValue !== undefined)
				object[k] = rootValue;
		}
	});
};

const setAutoHoverPrps = props => {
	const { hoverPrps } = props;
	if (!hoverPrps)
		return;

	const { on, off } = hoverPrps;

	if (on)
		recurseProps(props, on);

	if (off)
		recurseProps(props, off);
};

export default setAutoHoverPrps;
