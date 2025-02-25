//React
import { useEffect } from 'react';

//Opus
import { OC } from './library';

//Custom Component
const Wow = OC(({ children, state }) => {
	const { genStyles, genClassNames, genAttributes } = state;

	return (
		<div
			className={genClassNames}
			style={genStyles?.style}
			{...genAttributes}
		>
			{`User passed in ${state.someUserProp}`}
		</div>
	);
});

export default Wow;
