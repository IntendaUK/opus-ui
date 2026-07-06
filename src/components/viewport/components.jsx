//React
import React, { useContext, useEffect } from 'react';

//System
import { createContext } from '../../system/managers/appManager';

//Helpers
import { getKey } from '../../system/wrapper/helpers';
import { generateGuid } from '../../system/helpers';

//Events
import { onMdaChanged, onCloseTab } from './events';

//Context
const ViewportContext = createContext('viewport');

//Components
export const TabInner = () => {
	const props = useContext(ViewportContext);
	const { id, ChildWgt, getHandler, state: { mda = [], tabsMda = [], hasCloseOption, mdaIsJsx } } = props;

	//A JSX dashboard is a single React component, not an array of tab metadata, so use a stable
	// effect key here (onMdaChanged only builds tabs from the metadata array and no-ops for JSX).
	const effectDelta = mdaIsJsx
		? 'jsx'
		: `${mda.length}-${mda[0] ? mda[0].mda.id : ''}`;
	useEffect(getHandler(onMdaChanged), [effectDelta]);

	const handlerOnCloseTab = getHandler(onCloseTab);

	//Render JSX dashboards directly (as RegularInner does) so the dashboard's own props are kept.
	//Thread the viewport id as parentId so the loaded dashboard links into the scope/parent tree -
	// the JSON path does the equivalent via onGetMda (retMda.parentId = id). Without it the dashboard
	// subtree is orphaned and ancestor-scoped lookups (e.g. ||tabContainer||) can't resolve.
	if (mdaIsJsx) {
		const Component = mda;

		return <Component parentId={id} />;
	}

	if (!tabsMda.length)
		return null;

	return (
		<ChildWgt mda={{
			id: id + '_container',
			index: 'tabContainer',
			type: 'tabContainer',
			wgts: tabsMda,
			prps: {
				hideSingle: true,
				hasCloseOption,
				tabsMda,
				handlerOnCloseTab
			}
		}} />
	);
};

export const RegularInner = () => {
	const { id: viewportId, state: { mda, mdaIsJsx } } = useContext(ViewportContext);

	if (!mda)
		return null;

	//Thread the viewport id as parentId so the loaded dashboard links into the scope/parent tree -
	// the JSON path does the equivalent via onGetMda (retMda.parentId = id). Without it the dashboard
	// subtree is orphaned and ancestor-scoped lookups (e.g. ||tabContainer||) can't resolve.
	if (mdaIsJsx) {
		const Component = mda;

		return <Component parentId={viewportId} />;
	}

	const { ChildWgt, state: { mda: outerMda } } = useContext(ViewportContext);
	const { mda: { id, index, idGuid } } = outerMda;

	let key = getKey({ id, index });

	if (idGuid) {
		key = generateGuid();
		outerMda.mda.id = key;
	}

	return (
		<ChildWgt
			key={key}
			mda={outerMda.mda}
			parentAndPathSet={true}
		/>
	);
};

