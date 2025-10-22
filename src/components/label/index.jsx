//React
import React from 'react';

//External Helpers
import { Popover } from '../shared/popover/index';
import ExternalComponent from '../../system/wrapper/wrapperExternal';

//Props
import propSpec from './props';

//Styles
import './styles.css';

//Exports
export const Label = props => {
	const { id, classNames, style, attributes, state: { caption } } = props;

	return (
		<div
			id={id}
			className={classNames}
			style={style}
			{...attributes}
		>
			<Popover props={props} />
			{caption}
		</div>
	);
};

export const ExternalLabel = ExternalComponent(Label, { propSpec });