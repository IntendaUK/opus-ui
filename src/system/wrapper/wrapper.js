//React
import React, { useContext } from 'react';

//System
import { AppContext } from '../managers/appManager';

//System Helpers
import { getPropSpec } from '../managers/componentManager';
import { generateGuid } from '../helpers';

//Components
import WrapperDynamic from './wrapperDynamic';
import WrapperInner from './wrapperInner';
import WrapperStatic from './wrapperStatic';

//Helpers
const needsDynamicWrapper = mda => {
	const { id, index, type, blueprint, traits, wgts = [], condition, dynamic } = mda;

	const res = (
		blueprint !== undefined ||
		traits?.length ||
		index !== undefined ||
		type === undefined ||
		id === undefined ||
		condition !== undefined ||
		dynamic === true
	);
	if (res)
		return true;

	const wgtNeedsDynamicWrapper = wgts.some(w => needsDynamicWrapper(w));

	return wgtNeedsDynamicWrapper;
};

//Perf
window.tt = 0;
window.tc = 0;
const ids = {};

//Components
const Wrapper = props => {
	const { mda, children } = props;

	const appContext = useContext(AppContext);

	if (mda.split)
		return null;

	const mdaString = JSON.stringify(mda);

	let timeStart;
	if (mda.isStatic) {
		if (mda.traits?.length > 0) {
			console.log(mda);
		}
		if (!ids[mda.id]) {
			ids[mda.id] = 1;
			timeStart = performance.now();
		}
	}

	if (mda.isStatic) {
		return (
			<WrapperStatic
				key={mda.id}
				mda={mda}
				timeStart={timeStart}
				ctx={appContext}
			/>
		);
	}

	const isDynamic = needsDynamicWrapper(mda);
	if (isDynamic) {
		return (
			<WrapperDynamic
				mdaString={mdaString}
				mda={mda}
				children={children}
				ctx={appContext}
				timeStart={timeStart}
			/>
		);
	}

	const propSpec = getPropSpec(mda.type);
	if (!propSpec)
		return `Component type unsupported: ${mda.type}`;

	return (
		<WrapperInner
			key={mda.id}
			mdaString={mdaString}
			mda={mda}
			children={children}
			ctx={appContext}
				timeStart={timeStart}
		/>
	);
};

export { Wrapper };
