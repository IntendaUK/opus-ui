//React
import React from 'react';

//External Helpers
import { PopoverOwnEvents } from '@intenda/opus-ui';

//Events
import { onClick } from './events';

//Styles
import './styles.css';

//Exports
export const Label = props => {
	const { id, classNames, style, attributes, state } = props;
	const { hyperlink, cpt } = state;

	const popoverEvents = {};
	if (hyperlink)
		popoverEvents.onClick = onClick.bind(this, hyperlink);

	return (
		<div
			id={id}
			className={classNames}
			style={style}
			{...attributes}
		>
			<PopoverOwnEvents props={props} ownerOwnEvents={popoverEvents} />
			{cpt}
		</div>
	);
};
