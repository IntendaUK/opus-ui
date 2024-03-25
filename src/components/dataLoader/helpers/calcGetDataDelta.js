const calcGetDataDelta = ({ state, state: { deltaKeys } }) => {
	const deltaValues = deltaKeys.map(key => {
		const useKey = key === 'overrideFilters' ? 'filters' : key;

		let value = state[useKey];

		if (value instanceof Array || typeof (value) === 'object')
			value = JSON.stringify(value);

		return `${value}`;
	});

	const delta = deltaValues.join('-');

	return delta;
};

export default calcGetDataDelta;
