//React
import React, { useMemo } from 'react';

//Helpers
import { clone } from '../system/helpers';

const DataLoaderHelper = ({ ownerPrps: { id, state, ChildWgt } }) => {
	const { dataLoaderId, dataLoaderKeys, filters } = state;

	const flows = ['loading', 'data', 'recordCount'].map(f => ({
		to: id,
		fromKey: f,
		toKey: f
	}));

	const loaderPrps = {
		flows,
		deltaKeys: clone([], dataLoaderKeys)
	};

	const index = loaderPrps.deltaKeys.indexOf('filters');
	if (index > -1)
		loaderPrps.deltaKeys[index] = 'overrideFilters';

	loaderPrps.deltaKeys.forEach(k => {
		//We can't pass filters into dataLoader as that will invoke the setAction.
		// Instead we pass filters in as overrideFilters so that we are in control of them
		const value = (k === 'overrideFilters') ? filters : state[k];

		loaderPrps[k] = value;
	});

	const memoString = JSON.stringify(loaderPrps);
	const res = useMemo(() => {
		return (
			<ChildWgt mda={{
				id: dataLoaderId,
				type: 'dataLoader',
				prps: loaderPrps,
				auth: loaderPrps.deltaKeys
			}} />
		);
	}, [memoString]);

	return res;
};

export default DataLoaderHelper;
