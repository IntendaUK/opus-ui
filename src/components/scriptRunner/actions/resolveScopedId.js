//Helpers
import { getAllScopedIds } from '../../../system/managers/scopeManager';

const resolveScopedId = async (config, { ownerId }) => {
	const { anchorId: id = ownerId, scopedId } = config;

	const result = getAllScopedIds(`||${scopedId}||`, id);

	return result;
};

export default resolveScopedId;
