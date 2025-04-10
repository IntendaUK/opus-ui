//React
import { createRoot } from 'react-dom/client';

//System
import Opus, { Component } from './library';

//Custom Component
const OpusUI = () => {
	return (
		<div>
			<Component mda={{
				type: 'label',
				prps: { caption: 'Opus UI: Hit the perfect pitch between traditional development and low-code' }
			}} />
		</div>
	);
};

//Setup
const root = createRoot(document.getElementById('root'));

root.render(
	<Opus
		startupComponent={<OpusUI />}
	/>
);