const filtersDelete = (oldValue = [], deletedValue) => {
	if (!Array.isArray(deletedValue))
		deletedValue = [deletedValue];

	deletedValue.forEach(item => {
		const { key, value, operator = 'equals', forceRemove } = item;
		oldValue.spliceWhere(o => {
			const isMatch = (
				o.key === key &&
				(
					forceRemove ||
					(
						o.value === value &&
						o.operator === operator
					)
				)
			);

			return isMatch;
		});
	});

	return oldValue;
};

export default filtersDelete;
