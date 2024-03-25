import { useState, useEffect } from 'react';

const handler = (setKeyPressed, targetKey, isDown, { key }) => {
	if (key === targetKey)
		setKeyPressed(isDown);
};

const useKeyPress = targetKey => {
	const [keyPressed, setKeyPressed] = useState(false);

	useEffect(() => {
		const handlerDown = handler.bind(null, setKeyPressed, targetKey, true);
		const handlerUp = handler.bind(null, setKeyPressed, targetKey, false);

		window.addEventListener('keydown', handlerDown);
		window.addEventListener('keyup', handlerUp);

		return () => {
			window.removeEventListener('keydown', handlerDown);
			window.removeEventListener('keyup', handlerUp);
		};
	}, [targetKey]);

	return keyPressed;
};

export default useKeyPress;
