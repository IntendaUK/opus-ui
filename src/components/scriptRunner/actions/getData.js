//Config
import { dataLocations } from '../../../config';

//Helpers
import getPackagedData from './getData/getPackagedData';

const handlers = dataLocations.map(l => {
	const mapping = { packaged: getPackagedData }[l];

	return mapping;
});

export const getDataHelper = async (action, token) => {
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
