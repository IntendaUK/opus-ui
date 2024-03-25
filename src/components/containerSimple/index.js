//React
import React from 'react';

//External Helpers
import wrapWidgets from '../wrapWidgets';

//Styles
import './styles.css';

//Helpers
const getWgts = props => {
	const { children, state: { vis, renderChildren, renderChildrenWhenInvis } } = props;

	if (!renderChildren || (!vis && !renderChildrenWhenInvis))
		return null;

	const result = wrapWidgets(props);

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
