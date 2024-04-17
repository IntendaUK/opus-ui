//Config
import { dataLocations } from '../../../config';

//Helpers
import { getExternalDataLocations } from '../../../library/externalDataLocations';
import getPackagedData from './getData/getPackagedData';

//Internals
const defaultDataLocationsMap = { packaged: getPackagedData };

export const getDataHelper = async (action, token) => {
	const dataLocationsMap = {
		...defaultDataLocationsMap,
		...getExternalDataLocations()
	};

	const handlers = dataLocations.map(l => {
		const mapping = dataLocationsMap[l];

		return mapping;
	});

	const data = await (new Promise(async res => {
		for (const handler of handlers) {
			const handlerRes = await handler(action, token);
			if (handlerRes) {
				res(handlerRes);

				break;
			}
		}
	}));

	return data;
};

const getData = async (action, script, { getWgtState, setWgtState }) => {
	const { token } = getWgtState('app');

	const result = await getDataHelper(action, token);

	if (action.id)
		setWgtState(action.id, result);

	return result;
};

export default getData;
