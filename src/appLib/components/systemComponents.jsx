//React
import React from 'react';

//System
import { Wrapper } from '../../system/wrapper/wrapper';

//Config
import systemComponents from '../../system/systemComponents';

//Internal
const featureToIdMappings = {
	scripts: 'SCRIPTRUNNER',
	dropdowns: 'POPUP1',
	contextMenus: 'CONTEXT1',
	popovers: 'POPOVERS'
};

//Components
const SystemComponents = ({ features }) => {
	if (features !== undefined) {
		const result = features
			.map(f => {
				const component = systemComponents.find(s => s.id === featureToIdMappings[f]);

				return component;
			})
			.filter(f => f !== undefined)
			.map(({ id, type, prps = {} }) => {
				const mda = {
					id,
					type,
					prps
				};

				return <Wrapper key={id} mda={mda} />;
			});

		return result;
	}

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
