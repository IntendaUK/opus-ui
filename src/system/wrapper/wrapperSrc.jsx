//React
import { useState, useEffect, useMemo } from 'react';

//Events
const onMount = (mda, setType) => {
	const { src } = mda;

	if (!src)
		return;

	import(/* @vite-ignore */`../../${src}`)
		.then(mod => setType(mod));
};

//Component
const WrapperSrc = ({ mda, children }) => {
	const [Type, setType] = useState();

	useEffect(onMount.bind(null, mda, setType), [mda.src]);

	if (!Type)
		return;

	return (
		<Type.default {...mda}>
			{children}
		</Type.default>
	);
};

export default WrapperSrc;
