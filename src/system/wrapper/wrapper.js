//React
import React, { useContext, useState } from 'react';
import ReactDOM from 'react-dom';

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

	const [wrapperKey, setWrapperKey] = useState(0);
	const [doUnmount, setDoUnmount] = useState(false);

	const appContext = useContext(AppContext);

	const forceRemount = newMda => {
		if (newMda) {
			Object.keys(mda).forEach(k => delete mda[k]);

			Object.assign(mda, newMda);
		}

		setDoUnmount(true);
		setWrapperKey(prev => prev + 1);

		setTimeout(() => {
			setDoUnmount(false);
		}, 100);
	};

	if (doUnmount || mda.split)
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
				forceRemount={forceRemount}
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
			forceRemount={forceRemount}
		/>
	);
};

export { Wrapper };
