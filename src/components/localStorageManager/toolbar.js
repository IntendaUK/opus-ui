//React
import React, { useContext } from 'react';

//System
import { Wrapper } from '../../system/wrapper/wrapper';
import { createContext } from '../../system/managers/appManager';

//Events
import { onClose, onRemoveItem, onClearLocalStorage } from './events';

const LocalStorageManagerContext = createContext('localStorageManager');

const ClearLocalStorageButton = () => {
	const { id, getHandler, state: { lookupKeys } } = useContext(LocalStorageManagerContext);
	const handlerOnClick = getHandler(onClearLocalStorage);

	return (
		<Wrapper mda={{
			id,
			index: 'clearLocalStorageBtn',
			type: 'button',
			prps: {
				cpt: 'Clear All',
				enabled: !!lookupKeys.length,
				handlerOnClick
			},
			auth: ['enabled']
		}} />
	);
};

const RemoveItemButton = () => {
	const { id, getHandler } = useContext(LocalStorageManagerContext);
	const handlerOnClick = getHandler(onRemoveItem);

	return (
		<Wrapper mda={{
			id,
			index: 'removeBtn',
			type: 'button',
			prps: {
				cpt: 'Remove',
				enabled: false,
				handlerOnClick
			}
		}} />
	);
};

const CloseButton = () => {
	const { id, getHandler } = useContext(LocalStorageManagerContext);
	const handlerOnClick = getHandler(onClose);

	return (
		<Wrapper mda={{
			id,
			index: 'closeBtn',
			type: 'button',
			prps: {
				cpt: 'Close',
				handlerOnClick
			}
		}} />
	);
};

export const LocalStorageToolbar = () => {
	return (
		<Wrapper mda={{
			id: 'toolbar',
			type: 'container',
			prps: {
				className: 'localStorageToolbar',
				justify: 'space-between',
				toolbar: true
			}
		}} >
			<div className='localStorageActions'>
				<ClearLocalStorageButton />
				<RemoveItemButton />
			</div>
			<CloseButton />
		</Wrapper>
	);
};
