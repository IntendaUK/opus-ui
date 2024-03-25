//React
import { useContext, useEffect } from 'react';

//System
import { createContext } from '../../../system/managers/appManager';

//System Helpers
import { clone } from '../../../system/helpers';

//External Helpers
import { runScript } from '../../scriptRunner/interface';

//Helpers
import calcGetDataDelta from '../helpers/calcGetDataDelta';

//Context
const DataLoaderContext = createContext('dataLoader');

//Helpers
const onRunScripts = props => {
	const { id, state: { dtaScps } } = props;

	const clonedScps = Array.isArray(dtaScps) ? clone([], dtaScps) : clone([], [ dtaScps ]);
	clonedScps.forEach(c => {
		c.ownerId = id;
		runScript(c);
	});
};

const onNeedsNewData = props => {
	const { setState, state: { needsNewData } } = props;

	if (!needsNewData)
		return;

	onRunScripts(props);

	setState({ needsNewData: false });
};

//Components
const ScriptLoader = () => {
	const props = useContext(DataLoaderContext);

	const { getHandler, state: { needsNewData } } = props;

	const getDataDelta = calcGetDataDelta(props);

	useEffect(getHandler(onRunScripts), [getDataDelta]);

	useEffect(getHandler(onNeedsNewData), [needsNewData]);

	return null;
};

//Exports
export default ScriptLoader;
