//React
import React from 'react';

//External Helpers
import wrapWidgets from '../wrapWidgets';
import { clone } from '../../system/helpers';

//Styles
import './styles.css';

//Helpers
const getWgts = props => {
	const { ChildWgt, wgts, children, state: { vis, renderChildren, renderChildrenWhenInvis, cloneChildrenBeforeMount } } = props;

	if (!renderChildren || (!vis && !renderChildrenWhenInvis))
		return null;

	let useWgts = [];
	if (wgts?.length) {
		if (!cloneChildrenBeforeMount)
			useWgts.push(...wgts);
		else
			useWgts.push(...clone([], wgts));
	}

	const result = wrapWidgets({
		ChildWgt,
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

//Components
export const ContainerSimple = props => {
	const { id, classNames, style, attributes } = props;

	const useWgts = getWgts(props);

	return (
		<div
			id={id}
			className={classNames}
			style={style}
			{...attributes}
		>
			{useWgts}
		</div>
	);
};
