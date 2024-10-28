//React
import React, { useContext, useEffect } from 'react';

//System
import { createContext } from '../../system/managers/appManager';
import { ThemedComponent, DataLoaderHelper } from '../../library';

//Events
import onBuildMda from './events/onBuildMda';
import onProcessData from './events/onProcessData';
import onRefreshNode from './events/onRefreshNode';
import onSetChildData from './events/onSetChildData';
import onToggleParent from './events/onToggleParent';
import onRefreshParentNode from './events/onRefreshParentNode';

//Styles
import './styles.css';

//Context
const TreeContext = createContext('treeview');

//Components
const TreeviewInner = () => {
	const { state: { mdaChildren } } = useContext(TreeContext);

	if (!mdaChildren)
		return null;

	return (
		<ThemedComponent mda={mdaChildren} />
	);
};

export const Treeview = props => {
	const { id, getHandler, classNames, style, attributes, state } = props;
	const { data, expandedNodes } = state;
	const { tToggleParent, tSetChildData, tRefreshNode, tRefreshParentNode } = state;

	useEffect(getHandler(onProcessData), [JSON.stringify(data)]);
	useEffect(getHandler(onBuildMda), [JSON.stringify(data), JSON.stringify(expandedNodes)]);

	useEffect(getHandler(onRefreshNode), [tRefreshNode]);
	useEffect(getHandler(onToggleParent), [tToggleParent]);
	useEffect(getHandler(onRefreshParentNode), [tRefreshParentNode]);
	useEffect(getHandler(onSetChildData), [JSON.stringify(tSetChildData)]);

	return (
		<TreeContext.Provider value={props}>
			<div
				id={id}
				style={style}
				className={classNames}
				{...attributes}
			>
				<DataLoaderHelper ownerPrps={props} />
				<TreeviewInner />
			</div>
		</TreeContext.Provider>
	);
};
