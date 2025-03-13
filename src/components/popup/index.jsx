//React
import React, { useEffect } from 'react';

//System
import { createContext } from '../../system/managers/appManager';

//Events
import { onMount, onDisplayChange } from './events';

//Components
import { Combo } from './components';

//Styles
import './styles.css';

//Context
const PopupContext = createContext('popup');

export const Popup = props => {
	const { getHandler, state: { display, domNodeX } } = props;

	useEffect(getHandler(onMount), []);
	useEffect(getHandler(onDisplayChange), [display]);

	if (!display)
		return null;

	//Combo boxes have domNodeX defined (an element they should be tied to visually)
	if (domNodeX === undefined)
		return null;

	return (
		<PopupContext.Provider value={props}>
			<Combo />
		</PopupContext.Provider>
	);
};
