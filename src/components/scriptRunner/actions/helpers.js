import showNotification from './showNotification';

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

export const showNotificationMsg = (
	notificationType, { id: scriptId }, scriptProps, error = {}
) => {
	const notificationScriptId = `${scriptId}-notificationMsg`;

	const notificationData = {
		successful: {
			msg: 'Saved successfully',
			msgType: 'success'
		},
		noPrimaryKeys: {
			msg: 'Error updating records: No primary keys defined',
			msgType: 'danger'
		},
		requestError: {
			msg: `Error updating records: ${error.message}`,
			msgType: 'danger'
		}
	}[notificationType];

	showNotification(notificationData, notificationScriptId, scriptProps);
};

