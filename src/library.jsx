// -----------
// Imports
// -----------

//React
import React from 'react';

//System
import { Wrapper } from './system/wrapper/wrapper';
import { AppLib } from './appLib';

//System Helpers
import applyThemesToMdaPackage from './app/components/helpers/applyThemesToMdaPackage';
import { init as initComponentManager } from './system/managers/componentManager';
import { getExternalComponentTypes } from './library/externalComponentTypes';

//Setup
initComponentManager();

// -----------
// Exports
// -----------

//System
export { createContext } from './system/managers/appManager';
export { default as OpusComponents } from './appLib/components/systemComponents';
export { default as config } from './config';
export { stateManager } from './system/managers/stateManager';
export { Wrapper as Component } from './system/wrapper/wrapper';
export { default as loadApp } from './library/loadApp';
export { default as ExternalComponent } from './system/wrapper/wrapperExternal';

export const ThemedComponent = ({ mda }) => {
	applyThemesToMdaPackage(mda);

	return <Wrapper mda={mda} />;
};

const Opus = props => {
	return (
		<AppLib
			{...props}
			externalComponentTypes={getExternalComponentTypes()}
		/>
	);
};

export default Opus;

//System Helpers
export { default as applyThemesToMdaPackage } from './app/components/helpers/applyThemesToMdaPackage';
export { buildThemes } from './app/components/themeLoader';
export { getThemeValue, getThemes } from './system/managers/themeManager';
export { clone, getDeepProperty, generateGuid, generateClassNames, spliceWhere } from './system/helpers';
export { register as registerFlow, reset as resetFlowManager } from './system/managers/flowManager/index';
export { default as mapToColor } from './props/cssMaps/mapToColor';
export { default as mapToSize } from './props/cssMaps/mapToSize';
export { resolveThemeAccessor } from './system/managers/themeManager';
export { default as useEffectSkipFirst } from './system/customHooks/useEffectSkipFirst';
export { getScopedId, getDom, getNodeNamespace } from './system/managers/scopeManager';
export { default as dateFormatter } from './helpers/dateFormatter';
export { clearTraitCache } from './system/managers/traitManager/getTrait';
export { format } from './components/helpers';
export { getPropSpecs, applyPropSpecDefaults, getComponentTypes } from './system/managers/componentManager';
export { default as validate } from './validation/validate';
export { default as DataLoaderHelper } from './components/dataLoaderHelper';
export { registerComponentTypes } from './library/externalComponentTypes';
export { registerExternalDataLocations } from './library/externalDataLocations';
export { default as registerSuite } from './system/managers/suiteManager/register';
export { default as wrapWidgets } from './components/wrapWidgets';
export { reloadComponentsFromPath } from './system/managers/reloadManager';

//Script Actions
export { default as queryUrl } from './components/scriptRunner/actions/queryUrl';
export { default as configActions } from './components/scriptRunner/config/configActions';
export { default as getPath } from './components/scriptRunner/actions/pathFinding/getPath';
export { default as configTriggers } from './components/scriptRunner/config/configTriggers';
export { default as initAndRunScript } from './components/scriptRunner/helpers/initAndRunScript';
export { default as morphConfig, fixScopeIds } from './components/scriptRunner/helpers/morphConfig';
export { runScript } from './components/scriptRunner/interface';
export { buildWhereClause } from './components/scriptRunner/actions/helpers';
export { doesCollide } from './components/scriptRunner/actions/pathFinding/buildPathFindingMap';
export { registerExternalAction, setVariables } from './components/scriptRunner/actions';
export { applyComparison } from './components/scriptRunner/actions';
export { addMdaPackage as loadMdaPackage, getMdaPackage, setMdaPackage } from './components/scriptRunner/actions/getMda/getMda';
export { loadEnsemble, getMdaHelper as getMda, setMdaAtPath, getNamespace } from './components/scriptRunner/actions/getMda/getMda';
export { getCache, setCache } from './components/scriptRunner/actions/actionCacheActions';
export { default as performRequest } from './components/scriptRunner/actions/performRequest';

//Shared Propspecs
export { default as componentBaseProps } from './components/baseProps';
export { default as propsSharedContainer } from './components/container/propsShared';
export { default as propsSharedDataLoader } from './components/dataLoader/propsShared';
export { default as propsSharedDataLoaderExternal } from './components/dataLoader/propsSharedExternal';

//Local Storage (Deprecated)
export {
	getItem as localStorageGetItem,
	removeItem as localStorageRemoveItem,
	addItem as localStorageAddItem
} from './system/managers/localStorageManager';

//Popovers
export { Popover, PopoverOwnEvents, PopoverOwnRef } from './components/shared/popover';
