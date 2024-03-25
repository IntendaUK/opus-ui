import { getKey } from '../../system/wrapper/helpers';
import { getKeys as getLocalStorageKeys, clearLocalStorage,
	removeItem } from '../../system/managers/localStorageManager';

export const onMount = ({ setState }) => {
	const lookupKeys = getLocalStorageKeys();

	setState({ lookupKeys });
};

export const onClose = ({ setState }) => {
	setState({ display: false });
};

export const onRemoveItem = ({ id, setState, getWgtState, state: { lookupKeys } }) => {
	const keysGridKey = getKey({
		id,
		index: 'keysGrid'
	});

	const { value: { type, subType, key } } = getWgtState(keysGridKey);

	removeItem(type, subType, key);

	setState({ lookupKeys });
};

export const onClearLocalStorage = ({ setState, state: { lookupKeys } }) => {
	clearLocalStorage();

	setState({ lookupKeys });
};
