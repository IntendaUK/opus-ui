import React, { useEffect, useRef } from 'react';

import { createContext } from '../../system/managers/appManager';

import './styles.css';

const ModalContext = createContext('modal');

const onGetRef = ({ setState }, ref) => {
	setState({ ref });
};

export const SystemModal = props => {
	const { id, getHandler, classNames, attributes } = props;

	const ref = useRef();

	useEffect(getHandler(onGetRef), [ref]);

	return (
		<ModalContext.Provider value={props}>
			<div
				id={id}
				className={classNames}
				{...attributes}
				ref={ref}
			/>
		</ModalContext.Provider>
	);
};
