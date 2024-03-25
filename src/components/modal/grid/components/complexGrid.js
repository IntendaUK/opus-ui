//React
import React, { useContext } from 'react';

//System
import { createContext } from '../../../../system/managers/appManager';
import Grid from './grid';

//Context
const ModalContext = createContext('modal');

//Components
const GridToolbar = () => {
	const { id, ChildWgt } = useContext(ModalContext);

	return (
		<ChildWgt mda={{
			id,
			index: 'toolbar',
			type: 'containerSimple',
			prps: { mainAxisAlign: 'end' },
			wgts: [{
				id,
				index: 'closeButton',
				type: 'button',
				prps: {
					prpsIcon: { value: 'close' },
					fireScript: {
						id: 'closeModal',
						actions: [{
							type: 'setState',
							target: id,
							key: 'display',
							value: false
						}]
					}
				}
			}]
		}} />
	);
};

const ComplexGrid = () => {
	const props = useContext(ModalContext);
	const { id, ChildWgt } = props;

	const useId = `${id}-innerContainer`;

	return (
		<ChildWgt mda={{
			id: useId,
			type: 'containerSimple'
		}}>
			<GridToolbar />
			<Grid />
		</ChildWgt>
	);
};

export default ComplexGrid;
