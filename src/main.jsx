//React
import { createRoot } from 'react-dom/client';

//System
import Opus, { loadMdaPackage } from './library';

//Setup
const root = createRoot(document.getElementById('root'));

root.render(
	<Opus
		startupMda={{
			id: 'outer',
			type: 'container',
			prps: {
				singlePage: true,
				mainAxisAlign: 'center',
				crossAxisAlign: 'center',
				backgroundColor: '#111',
				gap: '24px'
			},
			wgts: [{
				type: 'containerSimple',
				prps: {},
				wgts: [{
					type: 'label',
					prps: {
						caption: 'I am a label',
						color: 'white'
					}
				}]
			}]
		}}
	/>
);