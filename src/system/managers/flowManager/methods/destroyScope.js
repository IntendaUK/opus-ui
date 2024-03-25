/*
	This method is called when a component unmounts where the scopeName is the id of the component
*/

//Helpers
import { destroyEventsForScope } from '../stores/storeEvents';
import { resetListenerValuesForScope, destroyListenersForScope } from '../stores/storeListeners';

//Exports
const destroyScope = scopeName => {
	destroyEventsForScope(scopeName);
	resetListenerValuesForScope(scopeName);
	destroyListenersForScope(scopeName);
};

export default destroyScope;
