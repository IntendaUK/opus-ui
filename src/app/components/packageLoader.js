//React
import { useEffect, useContext } from 'react';

//System
import { createContext } from '../../system/managers/appManager';
import { getHostedMda, setMdaPackage } from '../../components/scriptRunner/actions/getMda/getMda';
import { mdaPackageFileName } from '../../config';
import { init as initComponentManager } from '../../system/managers/componentManager';

//Context
const AppInnerContext = createContext('appInnerContext');

//Events
const onMount = ({ setState }) => {
	initComponentManager();

	(async () => {
		const mdaPackage = await getHostedMda({
			type: 'packaged',
			key: mdaPackageFileName
		});

		setMdaPackage(mdaPackage);

		setState({ mdaPackageLoaded: true });
	})();
};

//Components
export const PackageLoader = () => {
	const { getHandler } = useContext(AppInnerContext);

	useEffect(getHandler(onMount), []);

	return null;
};

//Exports
export default PackageLoader;
