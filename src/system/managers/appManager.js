//React
import React from 'react';

//System
import { appState, stateManager } from './stateManager';

//Context
export const AppContext = React.createContext('app');

//Manager
export const appManager = () => ({
	appState,
	...stateManager
});

const contexts = {};
export const createContext = contextName => {
	if (!contexts[contextName])
		contexts[contextName] = React.createContext(contextName);

	return contexts[contextName];
};
