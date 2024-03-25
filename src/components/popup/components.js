import React, { useContext, useMemo } from 'react';
import ReactDOM from 'react-dom';

import { createContext } from '../../system/managers/appManager';

import { onOptionClick } from './events';
import { calculateStyles } from './helpers';

const PopupContext = createContext('popup');

const ComboGrid = ({ flows }) => {
	const {
		id, getHandler, ChildWgt,
		state: { lookupData, lookupWgts, lookupPrps, lookupDtaObj, fromId }
	} = useContext(PopupContext);

	const handlerOnChange = getHandler(onOptionClick);

	return (
		<ChildWgt mda={{
			id,
			index: fromId,
			type: 'grid',
			prps: {
				staticData: lookupData,
				hasHeader: false,
				hasToolbar: false,
				hasFilterBuilder: false,
				handlerOnChange,
				flows,
				canManageColumns: false,
				dtaObj: lookupDtaObj,
				...lookupPrps
			},
			wgts: lookupWgts
		}} />
	);
};

const buildFlows = ({ id, state: { fromId, lookupFlows = [], lookupFilters = [] } }) => {
	const popupGridKey = `${id}-${fromId}`;
	const result = [];

	lookupFlows.forEach(f => {
		result.push({
			...f,
			to: f.to ?? fromId,
			scope: popupGridKey
		});
	});

	lookupFilters.forEach(f => {
		const { from = fromId, fromKey, fromSubKey, key } = f;
		const { ignoreEmptyString = true, operator = 'equals', value = '((value))' } = f;

		result.push({
			from,
			fromKey,
			fromSubKey,
			to: popupGridKey,
			toKey: 'filters',
			scope: popupGridKey,
			ignoreEmptyString,
			mapObject: {
				key,
				operator,
				value
			}
		});
	});

	return result;
};

export const Combo = () => {
	const { id, classNames, style, getHandler, state } = useContext(PopupContext);

	const { lookupStyleOverrides } = state;

	const builtStyle = {
		...style,
		...calculateStyles(state),
		...lookupStyleOverrides
	};

	const useFlows = useMemo(getHandler(buildFlows), []);

	return ReactDOM.createPortal(
		(
			<div
				id={id}
				className={classNames}
				style={builtStyle}
			>
				<ComboGrid flows={useFlows} />
			</div>
		),
		document.body
	);
};
