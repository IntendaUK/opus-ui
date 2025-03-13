//React
import React, { useContext, useEffect } from 'react';

//System
import { Wrapper } from '../../system/wrapper/wrapper';
import { createContext } from '../../system/managers/appManager';

//Styles
import './styles.css';

//Components
import { LocalStorageToolbar } from './toolbar';
import { LocalStorageKeys } from './localStorageKeys';

//Events
import { onMount } from './events';

const LocalStorageManagerContext = createContext('localStorageManager');

const LocalStorageCode = () => {
	const { id, state: { value } } = useContext(LocalStorageManagerContext);

	return (
		<div className='localStorageCode'>
			<Wrapper mda={{
				id,
				index: 'code',
				type: 'code',
				prps: {
					value,
					cpt: 'Cached Item'
				},
				auth: ['value']
			}} />
		</div>
	);
};

export const LocalStorageManager = props => {
	const { id, getHandler, classNames, state: { display } } = props;

	useEffect(getHandler(onMount), []);

	if (!display)
		return false;

	return (
		<LocalStorageManagerContext.Provider value={props}>
			<Wrapper mda={{
				id,
				index: 'container',
				type: 'container',
				container: 'SYSMODAL',
				prps: {
					cpt: 'Local Storage',
					modal: true,
					className: classNames
				}
			}}>
				<div className='innerContainer'>
					<LocalStorageKeys />
					<LocalStorageCode />
				</div>
				<LocalStorageToolbar />
			</Wrapper>
		</LocalStorageManagerContext.Provider>
	);
};
