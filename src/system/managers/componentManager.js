
import { init as initSetWgtState } from './stateManager/setWgtState';
import { init as initGetListenerStates } from './flowManager/helpers/applyListenerStates';
import { getTheme } from './themeManager';
import { clone } from '../helpers';
import baseProps from '../../components/baseProps/index';

//Components
import { Container } from '../../components/container';
import { ContainerSimple } from '../../components/containerSimple';
import { ContextMenuManager } from '../../components/contextMenuManager';
import { DataLoader } from '../../components/dataLoader';
import { Label } from '../../components/label';
import { LocalStorageManager } from '../../components/localStorageManager';
import { Modal } from '../../components/modal';
import { Popup } from '../../components/popup';
import { ScriptRunner } from '../../components/scriptRunner';
import { SystemModal } from '../../components/systemModal';
import { Viewport } from '../../components/viewport';

//External Components
import { ExternalContainerSimple } from '../../components/containerSimple';
import { ExternalLabel } from '../../components/label';

//PropSpecs
import propsContainer from '../../components/container/props';
import propsContainerSimple from '../../components/containerSimple/props';
import propsContextMenuManager from '../../components/contextMenuManager/props';
import propsDataLoader from '../../components/dataLoader/props';
import propsLabel from '../../components/label/props';
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
	label: Label,
	localStorageManager: LocalStorageManager,
	modal: Modal,
	popup: Popup,
	scriptRunner: ScriptRunner,
	systemModal: SystemModal,
	viewport: Viewport
};

const externalComponents = {
	containerSimple: ExternalContainerSimple,
	label: ExternalLabel
};

const propSpecs = {
	container: propsContainer,
	containerSimple: propsContainerSimple,
	contextMenuManager: propsContextMenuManager,
	dataLoader: propsDataLoader,
	label: propsLabel,
	localStorageManager: propsLocalStorageManager,
	modal: propsModal,
	popup: propsPopup,
	scriptRunner: propsScriptRunner,
	systemModal: propsSystemModal,
	viewport: propsViewport
};

const fullPropSpecs = {};

const setFullPropSpec = (type, propSpec) => {
	const fullPropSpec = {};
	clone(fullPropSpec, baseProps);
	clone(fullPropSpec, propSpec);

	fullPropSpecs[type] = fullPropSpec;
};

Object.entries(propSpecs).forEach(([k, v]) => {
	setFullPropSpec(k, v);
});

//Exports
export const registerExternalTypes = externalTypes => {
	externalTypes.forEach(({ type, component, propSpec }) => {
		components[type] = component;
		propSpecs[type] = propSpec;

		setFullPropSpec(type, propSpec);
	});
};

export const applyPropSpecDefaults = () => {
	const componentsTheme = getTheme('components');
	if (!componentsTheme)
		return;

	Object.entries(componentsTheme).forEach(([k, v]) => {
		if (!v.propSpec)
			return;

		const propSpec = propSpecs[k];
		const fullPropSpec = fullPropSpecs[k];

		if (propSpec)
			clone(propSpec, v.propSpec);

		if (fullPropSpec)
			clone(fullPropSpec, v.propSpec);
	});
};

export const getComponent = type => components[type];

export const getExternalComponent = type => externalComponents[type];

export const getPropSpec = type => propSpecs[type];

export const getFullPropSpec = type => fullPropSpecs[type] ?? baseProps;

export const getPropSpecs = () => propSpecs;

export const doesComponentTypeExist = type => !!components[type];

export const getComponentTypes = () => Object.keys(components);

export const init = () => {
	initSetWgtState({ getFullPropSpec });
	initGetListenerStates({ getPropSpec });
};
