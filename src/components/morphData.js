//Helpers
const applyFilter = (filter, data) => {
	const { key, operator, value: testValue } = filter;

	const value = data[key];
	const useOperator = operator.toLowerCase();

	if (useOperator === 'contains')
		return value.toLowerCase().includes(testValue.toLowerCase());
	else if (operator === 'containsCase')
		return value.includes(testValue);
	else if (useOperator === 'equals')
		return value === testValue;
	else if (useOperator === 'not equals')
		return value !== testValue;
	else if (useOperator === 'greater than')
		return value > testValue;
	else if (useOperator === 'less than')
		return value < testValue;
	else if (useOperator === 'greater than equal to')
		return value >= testValue;
	else if (useOperator === 'less than equal to')
		return value <= testValue;
	else if (operator === 'is null')
		return value === null;
	else if (operator === 'is not null')
		return value !== null;

	return true;
};

const morphData = (state, data) => {
	const { offset, pageSize, filters, sortField, sortAscending } = state;

	let morphedData = data.filter(d => filters.every(filter => applyFilter(filter, d)));

	const recordCount = morphedData.length;

	morphedData = morphedData.slice(offset, offset + pageSize);

	if (sortField) {
		morphedData.sort((a, b) => {
			return a[sortField] - b[sortField];
		});

		if (!sortAscending)
			morphedData.reverse();
	}

	const result = {
		data: morphedData,
		recordCount
	};

	return result;
};

export default morphData;
