//React
import React, { useContext } from 'react';

//System
import { createContext } from '../../system/managers/appManager';
import { PopoverOwnEvents } from '../../library';

//Styles
import './styles.css';
import 'material-icons/iconfont/material-icons.css';

const IconContext = createContext('iconContext');

//Internal
const iconClassNameMap = {
	filled: 'material-icons',
	outlined: 'material-icons-outlined',
	rounded: 'material-icons-round',
	sharp: 'material-icons-sharp',
	twoTone: 'material-icons-two-tone'
};

//Components
const Badge = () => {
	const { id, ChildWgt, state: { hasBadge, badgeValue } } = useContext(IconContext);

	if (!hasBadge)
		return null;

	return <ChildWgt mda={{
		id,
		type: 'badge',
		index: 'badge',
		prps: { badgeValue }
	}} />;
};

export const Icon = props => {
	const { id, style, attributes, classNames: classNamesBase, state } = props;
	const { value, handlerOnClick, title, iconStyle } = state;

	const classNames = `${classNamesBase} material-icons`;

	const popoverEvents = {};
	if (handlerOnClick)
		popoverEvents.onClick = handlerOnClick;

	const iconClassName = iconClassNameMap[iconStyle];

	return (
		<IconContext.Provider value={props}>
			<div
				id={id}
				className={classNames}
				style={style}
				{...attributes}
				title={title}
				onClick={handlerOnClick}
			>
				<PopoverOwnEvents props={props} ownerEvents={popoverEvents} />
				<span className={iconClassName}>{value}</span>
				<Badge />
			</div>
		</IconContext.Provider>

	);
};
