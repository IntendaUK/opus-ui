/* eslint-disable max-len */

//Extra props
import propsShared from './propsShared';

//Props
const props = {
	overrideFilters: {
		type: 'array',
		desc: 'A list of filter overrides'
	},
	processedData: {
		type: 'array',
		desc: 'Data that has already been processed',
		internal: true
	},
	needsNewData: {
		type: 'boolean',
		desc: 'When true, a new data request will be performed'
	},
	deltaKeys: {
		type: 'array',
		desc: 'A list of delta keys that, when changed, reloads the dataLoader component',
		internal: true,
		dft: () => []
	}
};

export default Object.assign(
	props,
	propsShared
);
