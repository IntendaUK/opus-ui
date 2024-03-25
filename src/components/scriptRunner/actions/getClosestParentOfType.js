import { stateManager } from '../../../system/managers/stateManager';

const getClosestParentOfType = ({ target, componentType, notComponentType }) => {
	let res = target;

	if (componentType && !componentType.includes)
		componentType = [ componentType ];

	if (notComponentType && !notComponentType.includes)
		notComponentType = [ notComponentType ];

	while (res) {
		const state = stateManager.getWgtState(res);
		if (!state)
			break;

		if (componentType && componentType.includes(state.type))
			break;

		if (notComponentType && !notComponentType.includes(state.type))
			break;

		res = state.parentId;
	}

	return res;
};

export default getClosestParentOfType;
