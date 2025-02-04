import { getComponentIdsForPath, forceRemount } from './stateManager';
import { getFilteredParentList } from './scopeManager';
import { clearTraitCache } from './traitManager/getTrait';
import { setMdaAtPath } from '../../components/scriptRunner/actions/getMda/getMda';

export const reloadComponentsFromPath = (path, newMda) => {
	clearTraitCache();

	const type = path.indexOf('blueprint/') === 0 ? 'blueprint' : 'dashboard';

	setMdaAtPath({
		type,
		key: path
			.replace('dashboard/', '')
			.replace('blueprint/', '')
			.replace('.json', ''),
		mda: newMda
	});

	const targets = getComponentIdsForPath(path);
	const parentIds = getFilteredParentList(targets);

	parentIds.forEach(id => {
		forceRemount(id, newMda);
	});
};
