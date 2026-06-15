//React
import React, { useState, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';

//System Helpers
import { getPropSpec } from '../managers/componentManager';
import { clone } from '../helpers';
import { hasSourceActionsInRunnablePrps } from './helpers';

//Helpers
import mdaChanged from './helpers/mdaChanged';

//Components
import WrapperDynamic from './wrapperDynamic';
import WrapperInner from './wrapperInner';
import WrapperSrc from './wrapperSrc';

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
		dynamic === true ||
		hasSourceActionsInRunnablePrps(mda)
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

	//Change detection. Instead of serializing the whole subtree to a string on every
	// render (the old JSON.stringify approach), we deep-compare the live mda against a
	// retained snapshot with early exit. The snapshot means in-place key mutations are
	// still caught; the version counter only changes when the content actually changed
	// and replaces the string token used by the memo/effect comparisons downstream.
	const mdaSnapshot = useRef(undefined);
	const mdaVersionRef = useRef(0);

	if (mdaChanged(mda, mdaSnapshot.current)) {
		mdaSnapshot.current = clone({}, mda);
		mdaVersionRef.current++;
	}
	const mdaVersion = mdaVersionRef.current;

	//needsDynamicWrapper is structural, so it only needs to be recomputed when the
	// content actually changes (i.e. when the version bumps).
	const isDynamic = useMemo(() => needsDynamicWrapper(mda), [mdaVersion]);

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

	if (mda.src) {
		return (
			<WrapperSrc
				mda={mda}
				children={children}
				forceRemount={forceRemount}
			/>
		);
	}

	if (isDynamic) {
		return (
			<WrapperDynamic
				mdaVersion={mdaVersion}
				mda={mda}
				children={children}
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
			mdaVersion={mdaVersion}
			mda={mda}
			children={children}
			forceRemount={forceRemount}
		/>
	);
};

export { Wrapper };
