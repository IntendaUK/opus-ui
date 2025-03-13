//React
import React, { useContext, useEffect } from 'react';

//System
import { createContext } from '../../system/managers/appManager';
import { Wrapper } from '../../system/wrapper/wrapper';
import { registerExternalAction } from '../../components/scriptRunner/actions';
import { stateManager } from '../../system/managers/stateManager';

//Context
const AppInnerContext = createContext('appInnerContext');

//Events
const onOpusReady = ({ preloadCompleted }) => {
	if (!preloadCompleted)
		return;

	window.opus = {
		mountExternal: (id, mda) => {
			stateManager.setWgtState('EXTERNALS', {
				extraWgts: [
					mda
				]
			});

			return {
				setState: stateManager.setWgtState.bind(null, id),
				getState: stateManager.getWgtState
			};
		},
		unmountExternal: id => {
			stateManager.cleanupState(id);
		},
		registerExternalAction
	};

	document.dispatchEvent(new CustomEvent('opusReady'));
};

//Components
const Dashboard = () => {
	const props = useContext(AppInnerContext);
	const { startupMda, startupComponent, preloadCompleted } = props;

	useEffect(onOpusReady.bind(null, props), [preloadCompleted]);

	if (!preloadCompleted)
		return null;

	if (startupComponent)
		return startupComponent;
	else if (startupMda)
		return <Wrapper key={startupMda.id} mda={startupMda} />;

	return null;
};

//Exports
export default Dashboard;
