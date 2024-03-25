//React
import { useContext, useEffect } from 'react';

//System
import { createContext } from '../../../system/managers/appManager';

//Helpers
import calcGetDataDelta from '../helpers/calcGetDataDelta';
import applyDataTransformations from '../helpers/applyDataTransformations';

//External Helpers
import { getDataHelper } from '../../scriptRunner/actions/getData';

//Context
const DataLoaderContext = createContext('dataLoader');

//Helpers
const getData = props => {
	const { setState, getWgtState, state } = props;
	const { dtaObj, needsNewData } = state;

	if (!needsNewData || !dtaObj)
		return;

	setState({ loading: true });

	(async () => {
		const { token } = getWgtState('app');

		const { data, recordCount } = await getDataHelper(state, token);
		applyDataTransformations(props, data);

		setState({
			loading: false,
			data,
			recordCount,
			deleteKeys: ['needsNewData']
		});
	})();
};

//Events
const onQueueGetData = ({ setState, state: { needsNewData } }) => {
	if (needsNewData)
		return;

	setState({ needsNewData: true });
};

//Components
const DynamicLoader = () => {
	const props = useContext(DataLoaderContext);
	const { getHandler, state: { needsNewData } } = props;

	const getDataDelta = calcGetDataDelta(props);
	useEffect(getHandler(onQueueGetData), [getDataDelta]);

	useEffect(getHandler(getData), [needsNewData]);

	return null;
};

//Exports
export default DynamicLoader;
