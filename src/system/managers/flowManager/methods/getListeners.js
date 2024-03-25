/*
	This method is only called by the flowManager component. We'll likely remove in the future in
		favour of just exposing this through a scriptrunner action instead
*/

//Helpers
import { getAllListeners } from '../stores/storeListeners';

//Exports
const getListeners = () => {
	const result = getAllListeners();

	return result;
};

export default getListeners;
