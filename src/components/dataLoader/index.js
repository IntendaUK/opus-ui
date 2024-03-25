//React
import React, { useEffect, useContext } from 'react';

//System
import { createContext } from '../../system/managers/appManager';

//Components
import StaticLoader from './staticLoader/index';
import DynamicLoader from './dynamicLoader/index';
import ScriptLoader from './scriptLoader';

//Context
const DataLoaderContext = createContext('dataLoader');

//Events
const onOverrideFilters = ({ setState, state: { filters, overrideFilters } }) => {
	if (!overrideFilters)
		return;

	filters.length = 0;
	filters.push(...overrideFilters);

	setState({
		filters,
		deleteKeys: ['overrideFilters']
	});
};

//Components
export const Loader = () => {
	const { state: { dtaScps, staticData, dtaObj, overrideFilters } } = useContext(DataLoaderContext);

	if (overrideFilters)
		return null;
	else if (dtaScps)
		return <ScriptLoader />;
	else if (staticData)
		return <StaticLoader />;
	else if (dtaObj)
		return <DynamicLoader />;

	return null;
};

export const DataLoader = props => {
	const { getHandler, state: { overrideFilters } } = props;

	useEffect(getHandler(onOverrideFilters), [JSON.stringify(overrideFilters)]);

	return (
		<DataLoaderContext.Provider value={props}>
			<Loader />
		</DataLoaderContext.Provider>
	);
};
