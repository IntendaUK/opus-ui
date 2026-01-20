//React
import React, { useEffect } from 'react';

//System
import { createContext } from '../../system/managers/appManager';
import { PopoverOwnEvents } from '../shared/popover';

//External Helpers
import wrapWidgets from '../wrapWidgets';
import { clone } from '../../system/helpers';

//Styles
import './styles.css';

//Components
import Clicker from './components/clicker';

//Events
import { onClick, onMouseOver, onMouseLeave, onContext, onContextMenuOpened } from './events';

//Context
const ContainerContext = createContext('container');

//Helpers
const getWgts = ({ ChildWgt, children, wgts = [], state }) => {
	const { vis, renderChildren, renderChildrenWhenInvis, extraWgts, cloneChildrenBeforeMount } = state;

	if (!renderChildren || (!vis && !renderChildrenWhenInvis))
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

export const Container = props => {
	const { id, getHandler, classNames, style, attributes, state } = props;
	const { canClick, handlerOnScroll, contextMenuOpened } = state;

	useEffect(getHandler(onContextMenuOpened), [contextMenuOpened]);

	const clicker = canClick ? <Clicker /> : null;

	const events = {
		onClick: getHandler(onClick),
		onMouseOver: getHandler(onMouseOver),
		onMouseLeave: getHandler(onMouseLeave),
		onContextMenu: getHandler(onContext)
	};

	if (handlerOnScroll)
		events.onScroll = getHandler(handlerOnScroll);

	const useWgts = getWgts(props);

	return (
		<ContainerContext.Provider value={props}>
			<div
				id={id}
				className={classNames}
				style={style}
				{...events}
				{...attributes}
			>
				<PopoverOwnEvents props={props} ownerEvents={events} />
				{clicker}
				{useWgts}
			</div>
		</ContainerContext.Provider>
	);
};
