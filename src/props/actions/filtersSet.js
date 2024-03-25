const filtersSet = (oldValue = [], newValue) => {
	if (!Array.isArray(newValue))
		newValue = [ newValue];

	newValue.forEach(({ key: nKey, value, operator = 'equals', removable = false }) => {
		oldValue.spliceWhere(({ key }) => key === nKey);
		oldValue.push({
			key: nKey,
			value,
			operator,
			removable
		});
	});

	return oldValue;
};

export default filtersSet;
