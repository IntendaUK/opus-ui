//React
import React from 'react';

//System
import { Wrapper } from '../../system/wrapper/wrapper';

//Config
import systemComponents from '../../system/systemComponents';

//Components
const SystemComponents = () => {
	const result = systemComponents
		.map(({ id, type, prps = {} }) => {
			const mda = {
				id,
				type,
				prps
			};

			return <Wrapper key={id} mda={mda} />;
		});

	return result;
};

//Exports
export default SystemComponents;
