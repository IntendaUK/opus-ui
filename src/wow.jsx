//React
import { useEffect } from 'react';

//Opus
import { ExternalComponent } from './library';

//Custom Component
const Wow = ExternalComponent(({ children, state }) => {
	const { genStyles, genClassNames, genAttributes } = state;

	return (
		<div
			className={genClassNames}
			style={genStyles?.style}
			{...genAttributes}
		>
			{`User passed in ${state.someUserProp} and someProp is ${state.someProp}`}
		</div>
	);
}, {
	propSpec: {
		someProp: {
			dft: '123'
		}
	}
});

export default Wow;
