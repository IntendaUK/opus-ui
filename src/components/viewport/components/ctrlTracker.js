//React
import { useContext, useEffect } from 'react';

//System
import { createContext } from '../../../system/managers/appManager';

//Hooks
import useKeyPress from '../../../system/customHooks/useKeyPress';

//Context
const ViewportContext = createContext('viewport');

//Events
export const onCtrlDown = ({ setState }, pressingCtrl) => {
	setState({ ctrlDown: pressingCtrl });
};

//Component
const CtrlTracker = () => {
	const { getHandler } = useContext(ViewportContext);

	const delta = useKeyPress('Control');

	useEffect(getHandler(onCtrlDown, delta), [delta]);

	return null;
};

export default CtrlTracker;
