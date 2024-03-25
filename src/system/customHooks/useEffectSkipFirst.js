import { useState, useEffect } from 'react';

//This hook is currently only used for onValueChange events in components and as such
// it only accept a single argument (besides the handler), which is the actual value
// of the component.
const useEffectSkipFirst = (handler, value) => {
	const [counter, setCounter] = useState(0);

	useEffect(() => {
		if (counter === 0) {
			setCounter(1);

			return;
		}

		handler();
	}, [counter, handler, value]);
};

export default useEffectSkipFirst;
