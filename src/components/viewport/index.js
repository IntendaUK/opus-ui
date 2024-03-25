//React
import React, { useEffect } from 'react';

//System
import { createContext } from '../../system/managers/appManager';
import wrapWidgets from '../wrapWidgets';

//Components
import { TabInner, RegularInner } from './components';
import CtrlTracker from './components/ctrlTracker';

//Events
import { onValueChange, onInputMdaChange } from './events';

//Styles
import './styles.css';

//Context
const ViewportContext = createContext('viewport');

export const Viewport = props => {
	const { id, getHandler, classNames, style, attributes, state, setState } = props;
	const { mda, inputMda, value, autoTab, ctrlTab, ctrlDown } = state;

	if (!value && props.value)
		setState({ value: props.value });

	const ctrlTracker = ctrlTab ? <CtrlTracker /> : null;

	useEffect(getHandler(onValueChange, ctrlDown), [value]);
	useEffect(getHandler(onInputMdaChange), [inputMda]);

	let inner = null;
	if (autoTab || ctrlTab)
		inner = <TabInner />;
	else if (mda)
		inner = <RegularInner />;
	else if (!inputMda)
		inner = wrapWidgets(props);

	return (
		<ViewportContext.Provider value={props}>
			<div
				id={id}
				className={classNames}
				style={style}
				{...attributes}
			>
				{inner}
				{ctrlTracker}
			</div>
		</ViewportContext.Provider>
	);
};
