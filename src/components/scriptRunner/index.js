//React
import { useEffect } from 'react';

//Interface
import { configure as configureInterface } from './interface';

export const ScriptRunner = props => {
	const { getHandler } = props;

	useEffect(getHandler(configureInterface), []);

	return null;
};
