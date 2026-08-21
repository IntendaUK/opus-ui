//React
import { useContext, useEffect } from 'react';

//Config
import { createContext } from '../../system/managers/appManager';
import { getMdaHelper } from '../../components/scriptRunner/actions/getMda/getMda';
import decodeDashboardUri from '../../system/helpers/decodeDashboardUri';

//Context
const AppInnerContext = createContext('appInnerContext');

//Helpers
const getDashboardMda = async (dashboard, dashboardUri) => {
	let result = null;

	if (dashboardUri)
		result = decodeDashboardUri(dashboardUri);
	else {
		result = await getMdaHelper({
			type: 'dashboard',
			key: dashboard
		});
	}

	return result;
};

//Events
const onLoadDashboard = ({ setState, dashboard, dashboardUri, urlParsed }) => {
	if (!urlParsed || (!dashboard && !dashboardUri))
		return;

	(async () => {
		const dashboardMda = await getDashboardMda(dashboard, dashboardUri);

		setState({ dashboardMda });
	})();
};

//Components
const DashboardLoader = () => {
	const { getHandler, dashboard, dashboardUri, urlParsed } = useContext(AppInnerContext);

	useEffect(getHandler(onLoadDashboard), [dashboard, dashboardUri, urlParsed]);

	return null;
};

//Exports
export default DashboardLoader;
