//React
import { createRoot } from 'react-dom/client';

//System
import Opus, { Component, loadApp } from './library';

//Custom Component
const OpusUI = () => {
	return (
		<div>
			<Component mda={{
				type: 'label',
				prps: { caption: `window._.spliceWhere defined: ${!!_.spliceWhere}` }
			}} />
		</div>
	);
};

//Setup
const root = createRoot(document.getElementById('root'));

root.render(
	<Opus
		windowHelpers={{
			include: [
				'spliceWhere'
			]
		}}
		startupComponent={<OpusUI />}
	/>
);
