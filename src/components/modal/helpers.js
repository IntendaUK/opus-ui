//Events
import { onGridValueChange } from './grid/events';

//Helpers
const buildFlows = ({ id, state: { fromId, lookupFlows, lookupFilters = [] } }) => {
	const modalGridKey = `${id}-${fromId}`;

	const flows = lookupFlows.map(f => {
		return {
			...f,
			to: f.to ?? fromId,
			scope: modalGridKey
		};
	});

	lookupFilters.forEach(f => {
		const { from = fromId, fromKey, fromSubKey, key } = f;
		const { ignoreEmptyString = true, operator = 'equals', value = '((value))' } = f;

		flows.push({
			from,
			fromKey,
			fromSubKey,
			to: modalGridKey,
			toKey: 'filters',
			scope: modalGridKey,
			ignoreEmptyString,
			mapObject: {
				key,
				operator,
				value
			}
		});
	});

	return flows;
};

export const generateGridMda = props => {
	const { id, getHandler, state } = props;
	const { lookupDtaObj, lookupWgts, lookupData, lookupPrps, fromId } = state;

	const flows = buildFlows(props);
	const handlerOnChange = getHandler(onGridValueChange);

	const gridPrps = {
		dtaObj: lookupDtaObj,
		staticData: lookupData,
		flows,
		hasColumnFilters: true,
		hasFilterBuilder: false,
		canManageColumns: false,
		...lookupPrps,
		handlerOnChange
	};

	return {
		gridId: id,
		gridIndex: fromId,
		gridPrps,
		gridWgts: lookupWgts
	};
};
