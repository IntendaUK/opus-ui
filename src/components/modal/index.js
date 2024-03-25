//React
import React, { useContext, useEffect } from 'react';

//System
import { createContext } from '../../system/managers/appManager';

//Styles
import './styles.css';

//Components
import Grid from './grid/components/grid';
import LookupGrid from './grid/components/lookupGrid';
import ComplexGrid from './grid/components/complexGrid';

//Context
const ModalContext = createContext('modal');

//Events
const onDisplayChange = ({ setState, state: { display, passthroughPrps } }) => {
	if (display)
		return;

	const deleteKeys = [
		'lookup',
		'lookupMda',
		'lookupPrps',
		'lookupData',
		'lookupDtaObj',
		'lookupFilters',
		'lookupWgts',
		'inputMda',
		'hidden'
	];

	if (passthroughPrps)
		deleteKeys.push(...passthroughPrps);

	setState({ deleteKeys });
};

//Components
const GridContainer = () => {
	const props = useContext(ModalContext);
	const { state: { complex, lookupMda } } = props;

	if (complex)
		return <ComplexGrid />;

	if (!lookupMda)
		return <Grid />;

	return <LookupGrid />;
};

const ModalViewport = () => {
	const { id, ChildWgt, state: { inputMda, lookup } } = useContext(ModalContext);

	return <ChildWgt mda={{
		id,
		index: 'viewport',
		type: 'viewport',
		prps: {
			inputMda,
			value: lookup
		},
		auth: ['inputMda', 'value']
	}} />;
};

export const Modal = props => {
	const { id, getHandler, classNames, attributes, state } = props;
	const { inputMda, lookup, display } = state;

	useEffect(getHandler(onDisplayChange), [display]);

	if (!display)
		return null;

	const inner = inputMda || lookup ? <ModalViewport /> : <GridContainer />;

	return (
		<ModalContext.Provider value={props}>
			<div
				id={id}
				className={classNames}
				{...attributes}>
				{inner}
			</div>
		</ModalContext.Provider>
	);
};
