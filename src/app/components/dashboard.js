//React
import React, { useContext } from 'react';

//System
import { createContext } from '../../system/managers/appManager';
import { Wrapper } from '../../system/wrapper/wrapper';

//Context
const AppInnerContext = createContext('appInnerContext');

//Components
const Dashboard = () => {
	const props = useContext(AppInnerContext);
	const { themesLoaded, dashboardMda, mdaPreloaded } = props;

	if (!themesLoaded || !dashboardMda || !mdaPreloaded)
		return null;

	return (
		<Wrapper key={dashboardMda.id} mda={dashboardMda} />
	);
};

//Exports
export default Dashboard;
