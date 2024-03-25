//React
import React, { useContext } from 'react';

//System
import { AppContext } from '../managers/appManager';

//System Helpers
import { getPropSpec } from '../managers/componentManager';

//Components
import WrapperDynamic from './wrapperDynamic';
import WrapperInner from './wrapperInner';

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

//Components
const Wrapper = props => {
	const { mda, children } = props;

	const appContext = useContext(AppContext);

	if (mda.split)
		return null;

	const mdaString = JSON.stringify(mda);

	const isDynamic = needsDynamicWrapper(mda);
	if (isDynamic) {
		return (
			<WrapperDynamic
				mdaString={mdaString}
				mda={mda}
				children={children}
				ctx={appContext}
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
		/>
	);
};

export { Wrapper };
