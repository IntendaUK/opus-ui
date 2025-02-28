import React, { useState, useEffect } from 'react';
import OC from '../../oc';
import { getMdaHelper } from '../../components/scriptRunner/actions/getMda/getMda';
import wrapWidgets from '../../components/wrapWidgets';
import { clone } from '../helpers';

const wrapChildren = ({ Child, children, wgts = [], state }) => {
	const { vis, renderChildren, renderChildrenWhenInvis, extraWgts, cloneChildrenBeforeMount } = state;

	if (!vis)
		return null;

	let useWgts = [];
	if (!cloneChildrenBeforeMount) {
		if (wgts?.length)
			useWgts.push(...wgts);
		if (extraWgts?.length)
			useWgts.push(...extraWgts);
	} else {
		if (wgts?.length)
			useWgts.push(...clone([], wgts));
		if (extraWgts?.length)
			useWgts.push(...clone([], extraWgts));
	}

	const result = wrapWidgets({
		ChildWgt: Child,
		wgts: useWgts
	});

	if (children) {
		if (children.length)
			result.push(...children);
		else
			result.push(children);
	}

	return result;
};

const onMount = (mda, setType) => {
	const { src: { path } } = mda;
	if (!path)
		return;

	(async () => {
		const handlerString = await getMdaHelper({
			type: 'dashboard',
			key: path,
			fileType: 'jsx'
		});

		const moduleUrl = /* @vite-ignore */`data:text/javascript;charset=utf-8,${encodeURIComponent(handlerString)}`;
		const handler = await import(/* @vite-ignore */ moduleUrl);

		const Component = handler.default.bind(null, { React, OC, wrapChildren });

		setType(Component);
	})();
};

const WrapperSrcFromMda = ({ mda, children }) => {
	const [Component, setComponent] = useState(null);

	useEffect(() => {
		onMount(mda, setComponent);
	}, [mda.src]);

	if (!Component)
		return null;

	return (
		<Component
			key={mda.id}
			{...mda}
		>
			{children}
		</Component>
	);
};

export default WrapperSrcFromMda;
