//React
import React, { useContext } from 'react';

//System
import { createContext } from '../../../../system/managers/appManager';

//Helpers
import { generateGridMda } from '../../helpers';

//Context
const ModalContext = createContext('modal');

//Components
const LookupGridInner = React.memo(({ props }) => {
	const { ChildWgt, state: { lookupMda } } = props;

	if (!lookupMda.blueprintPrps)
		lookupMda.blueprintPrps = {};

	Object.assign(lookupMda.blueprintPrps, generateGridMda(props));

	return <ChildWgt mda={lookupMda} />;
},
(oldProps, newProps) => {
	return JSON.stringify(oldProps) === JSON.stringify(newProps);
});

const LookupGrid = () => {
	const props = useContext(ModalContext);

	return <LookupGridInner props={props} />;
};

export default LookupGrid;
