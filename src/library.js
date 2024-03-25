//React
import React from 'react';

//Helpers
import applyThemesToMdaPackage from './app/components/helpers/applyThemesToMdaPackage';

//System
import { Wrapper } from './system/wrapper/wrapper';
import { AppLib } from './appLib';
import { getExternalComponentTypes } from './library/externalComponentTypes';

export { createContext } from './system/managers/appManager';

//ScriptRunner
export { default as configActions } from './components/scriptRunner/config/configActions';
export { default as configTriggers } from './components/scriptRunner/config/configTriggers';
export { default as getPath } from './components/scriptRunner/actions/pathFinding/getPath';
export { default as queryUrl } from './components/scriptRunner/actions/queryUrl';
export { buildWhereClause } from './components/scriptRunner/actions/helpers';
export { doesCollide } from './components/scriptRunner/actions/pathFinding/buildPathFindingMap';
export { runScript } from './components/scriptRunner/interface';
export { registerExternalAction } from './components/scriptRunner/actions';
export { applyComparison } from './components/scriptRunner/actions';
export { default as initAndRunScript } from './components/scriptRunner/helpers/initAndRunScript';
export { default as showNotification } from './components/scriptRunner/actions/showNotification';
export { addMdaPackage as loadMdaPackage } from './components/scriptRunner/actions/getMda/getMda';
export {
	default as morphConfig, fixScopeIds
} from './components/scriptRunner/helpers/morphConfig';

export {
	getThemeValue, getThemes
} from './system/managers/themeManager';

export {
	getItem as localStorageGetItem,
	removeItem as localStorageRemoveItem,
	addItem as localStorageAddItem
} from './system/managers/localStorageManager';

export {
	clone, getDeepProperty, generateGuid, generateClassNames
} from './system/helpers';

export { default as config } from './config';

export { stateManager } from './system/managers/stateManager';

export { register as registerFlow } from './system/managers/flowManager/index';

export { Wrapper as Component } from './system/wrapper/wrapper';

export { default as mapToColor } from './props/cssMaps/mapToColor';

export { default as mapToSize } from './props/cssMaps/mapToSize';

export { resolveThemeAccessor } from './system/managers/themeManager';

export { default as useEffectSkipFirst } from './system/customHooks/useEffectSkipFirst';

export { getScopedId } from './system/managers/scopeManager';

export { default as propsSharedContainer } from './components/container/propsShared';

export { default as propsSharedDataLoader } from './components/dataLoader/propsShared';

export { default as propsSharedDataLoaderExternal } from './components/dataLoader/propsSharedExternal';

export { default as loadApp } from './library/loadApp';

export { default as dateFormatter } from './helpers/dateFormatter';

export { format } from './components/helpers';

export { getPropSpecs } from './system/managers/componentManager';

export { default as validate } from './validation/validate';

export { default as DataLoaderHelper } from './components/dataLoaderHelper';

export { registerComponentTypes } from './library/externalComponentTypes';

export const ThemedComponent = ({ mda }) => {
	applyThemesToMdaPackage(mda);

	return <Wrapper mda={mda} />;
};

export {
	Popover, PopoverOwnEvents, PopoverOwnRef
} from './components/shared/popover';

export { default as wrapWidgets } from './components/wrapWidgets';

const Opus = props => {
	return (
		<AppLib
			{...props}
			externalComponentTypes={getExternalComponentTypes()}
		/>
	);
};

export default Opus;
