import spliceWhere from '@spliceWhere';

const filtersDelete = (oldValue = [], deletedValue) => {
	if (!Array.isArray(deletedValue))
		deletedValue = [deletedValue];

	deletedValue.forEach(item => {
		const { key, value, operator = 'equals', forceRemove } = item;
		spliceWhere(oldValue, o => {
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
