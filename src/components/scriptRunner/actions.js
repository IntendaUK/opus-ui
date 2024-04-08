/* eslint-disable max-lines */

//System
import opusConfig from '../../config';

//System Helpers
import { clone as cloneObject,
	generateGuid as sysGenerateGuid,
	getDeepProperty } from '../../system/helpers';
import { setTheme, finalizeTheme } from '../../system/managers/themeManager';

//External Helpers
import performValidation from '../../validation/validate';

//Exported Imports
export { clearActionCache } from './actions/actionCacheActions';
export { default as addClass } from './actions/addClass';
export { default as allCpnsHaveStates } from './actions/allCpnsHaveStates';
export { default as applyComparison } from './actions/applyComparison';
export { default as branch } from './actions/branch';
export { default as buildPathFindingMap } from './actions/pathFinding/buildPathFindingMap';
export { default as clearPersistedStates } from './actions/clearPersistedStates';
export { default as concatArray } from './actions/concatArray';
export { default as copyToClipboard } from './actions/copyToClipboard';
export { default as createFlow } from './actions/createFlow';
export { default as defineFunction } from './actions/defineFunction';
export { default as deleteKeys } from './actions/deleteKeys';
export { default as doesComponentOverflow } from './actions/doesComponentOverflow';
export { default as evalUnsafeJs } from './actions/evalUnsafeJs';
export { default as exitLoop } from './actions/exitLoop';
export { default as filterArray } from './actions/filterArray';
export { default as findInArray } from './actions/findInArray';
export { default as findIndexInArray } from './actions/findIndexInArray';
export { default as forceDirectGraph } from './actions/forceDirectGraph';
export { default as forLoop } from './actions/forLoop';
export { default as generateRandomInteger } from './actions/generateRandomInteger';
export { default as getBlueprint } from './actions/getBlueprint';
export { default as getClosestParentOfType } from './actions/getClosestParentOfType';
export { default as getComponentAtPosition } from './actions/getComponentAtPosition';
export { default as getComponentHeight } from './actions/getComponentHeight';
export { default as getComponentPosition } from './actions/getComponentPosition';
export { default as getComponentsOfType } from './actions/getComponentsOfType';
export { default as getComponentWidth } from './actions/getComponentWidth';
export { default as getData } from './actions/getData';
export { default as getDomTree } from './actions/getDomTree';
export { default as getFileDataUrl } from './actions/getFileDataUrl';
export { default as getFlows } from './actions/getFlows';
export { default as getNextComponentId } from './actions/getNextComponentId';
export { default as getPath } from './actions/pathFinding/getPath';
export { default as getTheme } from './actions/getTheme';
export { default as invokeFunctionModule } from './actions/invokeFunctionModule';
export { default as loadExternalJs } from './actions/loadExternalJs';
export { default as loadPersistedStates } from './actions/loadPersistedStates';
export { default as mapArray } from './actions/mapArray';
export { default as morphIterateArray } from './actions/morphIterateArray';
export { default as openUrl } from './actions/openUrl';
export { default as persistStates } from './actions/persistStates';
export { default as queryUrl } from './actions/queryUrl';
export { default as reduceArray } from './actions/reduceArray';
export { default as registerStylesheet } from './actions/registerStylesheet';
export { default as removeClass } from './actions/removeClass';
export { default as removeStylesheet } from './actions/removeStylesheet';
export { default as replaceInString } from './actions/replaceInString';
export { default as resetTheme } from './actions/resetTheme';
export { default as resolveScopedId } from './actions/resolveScopedId';
export { default as scrollComponent } from './actions/scrollComponent';
export { default as scrollToComponent } from './actions/scrollToComponent';
export { default as setPageFavicon } from './actions/setPageFavicon';
export { default as setPageTitle } from './actions/setPageTitle';
export { default as setTagState } from './actions/setTagState';
export { default as showDialog } from './actions/showDialog';
export { default as showNotification } from './actions/showNotification';
export { default as spliceArray } from './actions/spliceArray';
export { default as splitString } from './actions/splitString';
export { default as stringify } from './actions/stringify';
export { default as toggleClass } from './actions/toggleClass';
export { default as toggleLayoutDebug } from './actions/toggleLayoutDebug';
export { default as wait } from './actions/wait';

export {
	queueDelayedActions, cancelDelayedActions
} from './actions/timeouts';

export {
	queueIntervalActions, cancelIntervalActions
} from './actions/intervals';

export { default as stopScript } from './actions/stopScript';

export {
	setVariable, setVariables,
	deleteVariable, deleteVariables,
	pushVariable, popVariable, setVariableKey, setVariableKeys, deleteVariableKey
} from './actions/variableActions';

//Helpers
const externalActions = {};

export const registerExternalAction = ({ type, handler }) => {
	externalActions[type] = handler;
};

export const getExternalAction = type => {
	return externalActions[type];
};

//Actions
export const getState = ({ source, key = 'value' }, script, { getWgtState }) => {
	return (getWgtState(source) || {})[key];
};

export const setState = (config, script, props) => {
	const { target = script.ownerId, key = 'value', value } = config;

	if (opusConfig.env === 'development') {
		props.setWgtState(target, { [key]: value }, {
			id: script.ownerId,
			type: 'script.setState'
		});
	} else
		props.setWgtState(target, { [key]: value });
};

export const setMultiState = (config, script, { setWgtState }) => {
	const { target = script.ownerId, value } = config;

	if (opusConfig.env === 'development') {
		setWgtState(target, value, {
			id: script.ownerId,
			type: 'script.setMultiState'
		});
	} else
		setWgtState(target, value);
};

export const updateTheme = ({ theme, key, value }) => {
	if (value.includes('null'))
		return;

	setTheme({ [theme]: { [key]: value } });
	finalizeTheme(theme);
};

export const validate = ({ target, showNotifications }, script, props) => {
	performValidation(target, showNotifications, props);
};

export const log = ({ msg }) => {
	//eslint-disable-next-line no-console
	console.log(msg);
};

export const openLinkInTab = ({ lookupOptions, value }) => {
	if (!lookupOptions) {
		window.open(value);

		return;
	}

	const url = lookupOptions.find(o => o.id === value).url;
	window.open(url);
};

export const morphEntries = ({ value }) => Object.entries(value);
export const morphKeys = ({ value }) => Object.keys(value);
export const morphValues = ({ value }) => Object.values(value);
export const morphFromEntries = ({ value }) => Object.fromEntries(value);

export const morphTypeOf = ({ value }) => {
	if (value instanceof Array)
		return 'array';

	return typeof(value);
};

export const morphKeyPath = ({ value, path }) => {
	const result = getDeepProperty(value, path);

	return result;
};

export const morphObject = ({ value }) => {
	const result = value instanceof Array ? [] : {};

	cloneObject(result, value);

	return result;
};

export const joinArray = ({ value, separator }) => {
	let result = '';

	if (value && value.length)
		result = value.join(separator);

	return result;
};

export const generateGuid = () => {
	return sysGenerateGuid();
};

export const getPropSpec = ({ cpnType }, script, props, context) => {
	const propSpec = context.getPropSpec(cpnType);

	return propSpec;
};

export const parseJson = ({ value, errorResult }) => {
	try {
		return JSON.parse(value);
	} catch (e) {
		return errorResult;
	}
};

export const clone = ({ value }) => {
	const result = value instanceof Array ? [] : {};

	cloneObject(result, value);

	return result;
};

