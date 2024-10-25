//React
import React, { useContext, useEffect } from 'react';

//System
import { createContext } from '../../system/managers/appManager';

//Helpers
import { generateGuid } from '../../system/helpers';

//Events
import { onMdaChanged, onCloseTab } from './events';

//Context
const ViewportContext = createContext('viewport');

//Components
export const TabInner = () => {
	const props = useContext(ViewportContext);
	const { id, ChildWgt, getHandler, state: { mda = [], tabsMda = [], hasCloseOption } } = props;

	const effectDelta = `${mda.length}-${mda[0] ? mda[0].mda.id : ''}`;
	useEffect(getHandler(onMdaChanged), [effectDelta]);

	const handlerOnCloseTab = getHandler(onCloseTab);

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
	const { ChildWgt, state: { mda: outerMda } } = useContext(ViewportContext);

	if (!outerMda)
		return null;

	const { mda: { id } } = outerMda;

	return (
		<ChildWgt
			key={id}
			mda={outerMda.mda}
			parentAndPathSet={true}
		/>
	);
};
