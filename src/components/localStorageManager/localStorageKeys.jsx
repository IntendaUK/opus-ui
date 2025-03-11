//React
import React, { useContext } from 'react';

//System
import { Wrapper } from '../../system/wrapper/wrapper';
import { getItemForKey } from '../../system/managers/localStorageManager';
import { getKey } from '../../system/wrapper/helpers';
import { createContext } from '../../system/managers/appManager';

const LocalStorageManagerContext = createContext('localStorageManager');

const generateFlows = ({ id }) => {
	const codeKey = getKey({
		id,
		index: 'code'
	});

	const removeItemBtnKey = getKey({
		id,
		index: 'removeBtn'
	});

	const flows = [
		{
			to: codeKey,
			toKey: 'value',
			mapFunction: value => getItemForKey(value.lookupKey)
		},
		{
			to: removeItemBtnKey,
			toKey: 'enabled',
			mapFunction: value => !!value
		}
	];

	return flows;
};

const generateKeysGridMda = props => {
	const { id, state: { lookupKeys } } = props;
	const flows = generateFlows(props);

	const keysGridMda = {
		id,
		index: 'keysGrid',
		type: 'grid',
		prps: {
			cpt: 'Keys',
			staticData: lookupKeys,
			flows
		},
		auth: ['staticData'],
		wgts: [
			{
				id: 'lookupKey',
				cpt: 'Key'
			}
		]
	};

	return keysGridMda;
};

export const LocalStorageKeys = () => {
	const props = useContext(LocalStorageManagerContext);

	const keysGridMda = generateKeysGridMda(props);

	return (
		<div className='localStorageKeys'>
			<Wrapper mda={keysGridMda} />
		</div>
	);
};
