//React
import { useContext, useEffect } from 'react';

//System
import { createContext } from '../../../system/managers/appManager';

//System Helpers
import { clone } from '../../../system/helpers';

//Helpers
import calcGetDataDelta from '../helpers/calcGetDataDelta';
import applyDataTransformations from '../helpers/applyDataTransformations';
import morphData from '../../morphData';

//Context
const DataLoaderContext = createContext('dataLoader');

//Events
const onStaticDataChanged = ({ setState, state: { staticData, processedData } }) => {
	if (JSON.stringify(staticData) === JSON.stringify(processedData))
		return;

	const newProcessedData = clone([], staticData);

	setState({ processedData: newProcessedData });
};

const onRequireDataProcessing = props => {
	const { setState, state, state: { processedData, needsNewData } } = props;

	if (!processedData || !needsNewData)
		return;

	const { data, recordCount } = morphData(state, processedData);
	applyDataTransformations(props, data);

	setState({
		data,
		recordCount,
		needsNewData: false
	});
};

const onQueueProcessData = ({ setState, state: { needsNewData } }) => {
	if (needsNewData)
		return;

	setState({ needsNewData: true });
};

//Components
const StaticLoader = () => {
	const props = useContext(DataLoaderContext);
	const { getHandler, state: { staticData, processedData, needsNewData } } = props;

	useEffect(getHandler(onStaticDataChanged), [staticData]);

	const manipulationChangedDelta = calcGetDataDelta(props);
	useEffect(getHandler(onQueueProcessData), [manipulationChangedDelta, processedData]);

	useEffect(getHandler(onRequireDataProcessing), [processedData, needsNewData]);

	return null;
};

//Exports
export default StaticLoader;
