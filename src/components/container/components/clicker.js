//React
import { useContext, useEffect } from 'react';

//System
import { createContext } from '../../../system/managers/appManager';

//External Helpers
import initAndRunScript from '../../scriptRunner/helpers/initAndRunScript';

//Context
const ContainerContext = createContext('container');

//Events
const onClickChanged = ({ id, setState, state }) => {
	const { clicked, clickedArgs, handlerOnClick, fireScript } = state;

	if (!clicked)
		return;

	if (fireScript) {
		fireScript.ownerId = id;

		initAndRunScript({
			script: fireScript,
			setVariables: { clickedArgs },
			isRootScript: true
		});
	}

	if (handlerOnClick)
		handlerOnClick();

	setTimeout(() => {
		setState({
			clicked: false,
			deleteKeys: [ 'clickedArgs' ]
		})
	});
};

//Components
const Clicker = () => {
	const { getHandler, state: { clicked } } = useContext(ContainerContext);

	useEffect(getHandler(onClickChanged), [clicked]);

	return null;
};

export default Clicker;