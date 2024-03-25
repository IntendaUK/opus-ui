/*
	This method is called by the integration test runner
		to ensure that flows are cleared between tests.
*/

//Helpers
import { resetEvents } from '../stores/storeEvents';
import { resetListeners } from '../stores/storeListeners';

//Exports
const reset = () => {
	resetEvents();
	resetListeners();
};

export default reset;
