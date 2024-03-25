/* eslint-disable max-lines */

import { init as initSetWgtState } from './stateManager/setWgtState';
import { init as initGetListenerStates } from './flowManager/helpers/applyListenerStates';
import { getTheme } from './themeManager';
import { clone } from '../helpers';

//Components
import { Container } from '../../components/container';
import { ContainerSimple } from '../../components/containerSimple';
import { ContextMenuManager } from '../../components/contextMenuManager';
import { DataLoader } from '../../components/dataLoader';
import { LocalStorageManager } from '../../components/localStorageManager';
import { Modal } from '../../components/modal';
import { Popup } from '../../components/popup';
import { ScriptRunner } from '../../components/scriptRunner';
import { SystemModal } from '../../components/systemModal';
import { Viewport } from '../../components/viewport';

//PropSpecs
import propsContainer from '../../components/container/props';
import propsContainerSimple from '../../components/containerSimple/props';
import propsContextMenuManager from '../../components/contextMenuManager/props';
import propsDataLoader from '../../components/dataLoader/props';
import propsLocalStorageManager from '../../components/localStorageManager/props';
import propsModal from '../../components/modal/props';
import propsPopup from '../../components/popup/props';
import propsScriptRunner from '../../components/scriptRunner/props';
import propsSystemModal from '../../components/systemModal/props';
import propsViewport from '../../components/viewport/props';

//Internal
const components = {
	container: Container,
	containerSimple: ContainerSimple,
	contextMenuManager: ContextMenuManager,
	dataLoader: DataLoader,
	localStorageManager: LocalStorageManager,
	modal: Modal,
	popup: Popup,
	scriptRunner: ScriptRunner,
	systemModal: SystemModal,
	viewport: Viewport
};

const propSpecs = {
	container: propsContainer,
	containerSimple: propsContainerSimple,
	contextMenuManager: propsContextMenuManager,
	dataLoader: propsDataLoader,
	localStorageManager: propsLocalStorageManager,
	modal: propsModal,
	popup: propsPopup,
	scriptRunner: propsScriptRunner,
	systemModal: propsSystemModal,
	viewport: propsViewport
};

//Exports
export const registerExternalTypes = externalTypes => {
	if (!window.lll)
		window.lll = [];

	let found = window.lll.find(l => l === components);
	if (!found)
		window.lll.push(components);

	externalTypes.forEach(({ type, component, propSpec }) => {
		components[type] = component;
		propSpecs[type] = propSpec;
	});
};

export const applyPropSpecDefaults = () => {
	const componentsTheme = getTheme('components');
	if (!componentsTheme)
		return;

	Object.entries(componentsTheme).forEach(([k, v]) => {
		const propSpec = propSpecs[k];
		if (!propSpec || !v.propSpec)
			return;

		clone(propSpec, v.propSpec);
	});
};

export const getComponent = type => components[type];

export const getPropSpec = type => propSpecs[type];

export const getPropSpecs = () => propSpecs;

export const doesComponentTypeExist = type => !!components[type];

export const init = () => {
	initSetWgtState({ getPropSpec });
	initGetListenerStates({ getPropSpec });
};
