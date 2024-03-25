//External Helpers
import morphData from '../../../morphData';
import { getPackagedMda } from '../getMda/getMda';

//Helper
const getPackagedData = async action => {
	const unmorphedData = await getPackagedMda({
		type: 'data',
		key: action.dtaObj,
		returnLabelWhenNotFound: false
	});

	if (!unmorphedData)
		return null;

	const { data, recordCount } = morphData(action, unmorphedData);

	return {
		data,
		recordCount
	};
};

export default getPackagedData;
