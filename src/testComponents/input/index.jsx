// React
import React, { useEffect, useContext } from 'react';

// System
import { createContext } from '../../library';

const InputContext = createContext('input');

//Events
const onInput = ({ setState, state: { value } }, e) => {
	const newValue = e.target.value;

	if (newValue !== value)
		setState({ value: newValue });
};

//Components
const InputElement = () => {
	const props = useContext(InputContext);

	const { getHandler, state: { value } } = props;

	const handlerOnInput = getHandler(onInput);

	const inputProps = { value };

	return (
		<input
			className={'input'}
			onInput={handlerOnInput}
			{...inputProps}
		/>
	);
};

export const Box = () => {
	const props = useContext(InputContext);

	return (
		<div className='box'>
			<InputElement />
		</div>
	);
};

const Input = props => {
	const { id, style, classNames, attributes, state: { value } } = props;

	return (
		<InputContext.Provider value={props}>
			<div
				id={id}
				style={style}
				className={classNames}
				{...attributes}
			>
				<Box />
			</div>
		</InputContext.Provider>
	);
};

export default Input;
