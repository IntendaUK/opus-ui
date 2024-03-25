//React
import { useEffect, useContext } from 'react';

//System
import { AppContext } from '../../system/managers/appManager';

//Interface
import { configure as configureInterface } from './interface';

export const ScriptRunner = props => {
	const { getHandler } = props;

	const context = useContext(AppContext);

	useEffect(getHandler(configureInterface, context), []);

	return null;
};
