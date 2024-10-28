//React
import React, { useEffect } from 'react';

//System
import { createContext } from '../../system/managers/appManager';
import { PopoverOwnEvents, wrapWidgets } from '../../library';

//Styles
import './styles.css';

//Components
import { TextComponent, IconComponent, BadgeComponent } from './components';

//Events
import { onClick, onClickChanged } from './events';

//Context
const ButtonContext = createContext('button');

//Components
export const Button = props => {
	const { id, classNames, style, attributes, getHandler, state: { clicked } } = props;

	useEffect(getHandler(onClickChanged), [clicked]);

	const handlerOnClick = getHandler(onClick);

	const events = { onClick: handlerOnClick };

	return (
		<div
			id={id}
			className={classNames}
			style={style}
			{...events}
			{...attributes}
		>
			<ButtonContext.Provider value={props}>
				<PopoverOwnEvents props={props} ownerEvents={events} />
				<IconComponent />
				<TextComponent />
				<BadgeComponent />
				{wrapWidgets(props)}
			</ButtonContext.Provider>
		</div>
	);
};
