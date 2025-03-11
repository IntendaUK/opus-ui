import React, { useContext } from 'react';

//System
import { createContext } from '../../../../system/managers/appManager';

//Helpers
import { generateGridMda } from '../../helpers';

//Context
const ModalContext = createContext('modal');

//Components
const Grid = () => {
	const props = useContext(ModalContext);

	const { ChildWgt } = props;

	const { gridId, gridIndex, gridPrps, gridWgts } = generateGridMda(props);

	return (
		<ChildWgt mda={{
			id: gridId,
			index: gridIndex,
			type: 'grid',
			prps: gridPrps,
			wgts: gridWgts
		}} />
	);
};

export default Grid;
