import { getComponentIdsForPath, forceRemount } from './stateManager';
import { getFilteredParentList } from './scopeManager';
import { clearTraitCache } from './traitManager/getTrait';
import { setMdaAtPath } from '../../components/scriptRunner/actions/getMda/getMda';
import applyThemesToMdaPackage from '../../app/components/helpers/applyThemesToMdaPackage';

export const reloadComponentsFromPath = (path, newMda) => {
	//This has a side-effect. It modifies newMda in place
	applyThemesToMdaPackage(newMda);

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
