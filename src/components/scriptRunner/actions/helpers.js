export const buildWhereClause = filters => {
	const whereClause = filters
		.map(({ key, value, operator = 'contains' }) => {
			const useOperator = {
				contains: 'like',
				containsCaseInsensitivePostgres: 'ilike',
				equals: '=',
				equalsCaseInsensitivePostgres: 'ilike',
				'less than': '<',
				'greater than': '>',
				'not equals': '<>',
				'greater than equal to': '>=',
				'less than equal to': '<=',
				'is null': 'is',
				'is not null': 'is not'
			}[operator];

			let useValue = value;
			if (['contains', 'containsCaseInsensitivePostgres'].includes(operator))
				useValue = `%${value}%`;

			if (['is null', 'is not null'].includes(operator))
				useValue = 'null';
			else
				useValue = `'${useValue}'`;

			const result = `${key} ${useOperator} ${useValue}`;

			return result;
		})
		.join(' AND ');

	return whereClause;
};

