//This file contains props that are used by any component that
// can own a dataLoader (like a grid or repeater)

//Props
const props = {
	dataLoaderId: {
		type: 'string',
		desc: 'The id assigned to the dataLoader component',
		dft: (_, id) => `${id}-dataLoader`
	},
	dataLoaderKeys: {
		type: 'array',
		desc: 'Extra keys to pass to the dataLoader component',
		dft: () => [
			'offset',
			'pageSize',
			'filters',
			'dtaObj',
			'dtaScps',
			'staticData',
			'sortField',
			'sortAscending',
			'dataTransformations'
		]
	}
};

export default props;
