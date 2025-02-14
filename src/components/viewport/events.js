import { getDeepProperty, resolveRelativePath } from '../../system/helpers';

import { getMdaHelper } from '../scriptRunner/actions/getMda/getMda';

import { activateNextTab, activateTab } from './helpers';

const onGetMda = (props, ctrlDown, value, retMda) => {
	const { id, setState, setWgtState, state: { autoTab, ctrlTab, tabsMda } } = props;
	let { state: { mda } } = props;

	retMda.parentId = id;

	if (autoTab || ctrlTab) {
		if (mda) {
			const existingTabIndex = mda.findIndex(m => m.id === retMda.id);
			if (existingTabIndex !== -1) {
				activateTab(tabsMda, setWgtState, existingTabIndex);

				return;
			}
		}

		if (mda && (!ctrlTab || ctrlDown)) {
			mda.push({
				value,
				mda: retMda
			});
		} else {
			mda = [ {
				value,
				mda: retMda
			}];
		}
	} else {
		mda = {
			value,
			mda: retMda
		};
	}

	setState({ mda });
};

export const onInputMdaChange = ({ setState, state: { inputMda, ctrlTab, autoTab } }) => {
	if (!inputMda)
		return;

	let newMda = null;

	if (ctrlTab || autoTab)
		newMda = [{ mda: inputMda }];
	else
		newMda = { mda: inputMda };

	setState({ mda: newMda });
};

const onValueCleared = (
	{ setState, state: { mda = [], autoTab, ctrlTab, oldValue } }
) => {
	if (!oldValue)
		return;

	if (autoTab || ctrlTab) {
		mda.spliceWhere(({ value }) => value === oldValue);
		setState({ mda });
	} else if (mda.value === oldValue)
		setState({ deleteKeys: ['mda'] });
};

export const onValueChange = (
	props,
	ctrlDown
) => {
	const { state: { value, path } } = props;
	if (!value) {
		onValueCleared(props);

		return;
	}

	(async () => {
		let folderPath = path.replace('dashboard/', '');
		folderPath = folderPath.substring(0, folderPath.lastIndexOf('/'));

		const key = resolveRelativePath(value, folderPath);

		const mda = await getMdaHelper({
			type: 'dashboard',
			key
		});

		if (!mda)
			return;

		onGetMda(props, ctrlDown, value, mda);
	})();
};

export const onMdaChanged = ({ setState, setWgtState, state: { mda = [] } }) => {
	const tabsMda = mda.map(({ mda: m }, i) => {
		const res = {
			id: m.id + '_tab',
			type: 'tab',
			prps: { cpt: m.cpt ?? `Tab ${i + 1}` },
			wgts: [m]
		};

		if (i === mda.length - 1)
			res.prps = { active: true };
		else
			setWgtState(res.id, { active: false });

		return res;
	});

	setState({ tabsMda });
};

export const onCloseTab = ({ setWgtState, setState, state: { value, mda, tabsMda } }, tabId) => {
	const tabIndex = tabsMda.findIndex(({ id }) => id === tabId);
	const tab = tabsMda[tabIndex];
	const innerWgtId = tab.wgts[0].id;

	mda.splice(tabIndex, 1);
	tabsMda.spliceWhere(t => t === tab);

	const newState = {
		mda,
		tabsMda
	};

	if (value === innerWgtId)
		newState.deleteKeys = ['value'];

	if (getDeepProperty(tab, 'prps.active'))
		activateNextTab(setWgtState, tabsMda, tabIndex);

	setState(newState);
};

