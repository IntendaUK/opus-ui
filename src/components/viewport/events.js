/* eslint-disable no-inline-comments */
/* eslint-disable max-lines-per-function */

//System Helpers
import { getDeepProperty, spliceWhere } from '../../system/helpers';
import { getMdaHelper } from '../scriptRunner/actions/getMda/getMda';

//Helpers
import { activateNextTab, activateTab } from './helpers';

//Helpers
const resolveRelativePath = (path, cwd) => {
	if (path.indexOf('./') !== 0)
		return path;

	let result = cwd;

	const splitPath = path.split('/');

	splitPath.forEach(s => {
		if (s === '.')
			return;
		else if (s === '..')
			result = result.substr(0, result.lastIndexOf('/'));
		else if (result.length > 0)
			result += '/' + s;
		else
			result += s;
	});

	return result;
};

//Events
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
		spliceWhere(mda, ({ value }) => value === oldValue);
		setState({ mda });
	} else if (mda.value === oldValue)
		setState({ deleteKeys: ['mda'] });
};

export const onValueChange = (props, ctrlDown) => {
	const { setState, state: { value, path = '', loadFromJsx } } = props;
	if (!value) {
		onValueCleared(props);

		return;
	}

	(async () => {
		let key = value;

		//Resolve relative paths
		if (value.indexOf('./') === 0) {
			let folderPath = path.replace('dashboard/', '');
			folderPath = folderPath.substring(0, folderPath.lastIndexOf('/'));

			key = resolveRelativePath(value, folderPath);
		}

		if (value.endsWith('.jsx') || loadFromJsx) {
			try {
				const importPath = value.endsWith('.jsx') ? value : `${value}.jsx`;
				const moduleUrl = `/src/dashboard/${importPath}`;
				const module = await import(/* @vite-ignore */ moduleUrl);

				if (!module || !module.default)
					throw new Error('JSX module missing default export');

				setState({
					mda: module.default,
					mdaIsJsx: true
				});
			} catch (err) {
				console.error('Failed to load JSX dashboard', err);
			}

			return;
		}

		const mda = await getMdaHelper({
			type: 'dashboard',
			key
		});

		if (!mda)
			return;

		setState({
			mda,
			mdaIsJsx: false
		});

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
	spliceWhere(tabsMda, t => t === tab);

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

