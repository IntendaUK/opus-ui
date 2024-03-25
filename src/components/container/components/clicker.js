//React
import { useContext, useEffect } from 'react';

//System
import { createContext } from '../../../system/managers/appManager';

//External Helpers
import { runScript } from '../../scriptRunner/interface';

//Context
const ContainerContext = createContext('container');

//Events
const onClickChanged = ({ id, setState, state }) => {
	const { clicked, handlerOnClick, fireScript } = state;

	if (!clicked)
		return;

	if (fireScript) {
		fireScript.ownerId = id;
		runScript(fireScript);
	}

	if (handlerOnClick)
		handlerOnClick();

	setTimeout(() => setState({ clicked: false }));
};

//Components
const Clicker = () => {
	const { getHandler, state: { clicked } } = useContext(ContainerContext);

	useEffect(getHandler(onClickChanged), [clicked]);

	return null;
};

export default Clicker;
