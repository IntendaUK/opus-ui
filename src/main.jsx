//React
import { createRoot } from 'react-dom/client';

//System
import Opus, { loadMdaPackage } from './library';

//Setup
const root = createRoot(document.getElementById('root'));

root.render(
	<Opus
		options={{
			env: 'development'
		}}
		startupMda={{
			scope: ['outerScope', 'localScope'],
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
				scope: 'innerScope',
				type: 'containerSimple',
				prps: {
					scps: [{
						triggers: [{
							event: 'onStateChange',
							key: 'hovered'
						}],
						actions: [{
							type: 'setState',
							target: '||localScope.label||',
							key: 'hovered',
							value: '{{state.||outerScope||.hovered}}'
						}]
					}]
				},
				wgts: [{
					relId: 'label',
					type: 'label',
					prps: {
						caption: 'I am a label',
						color: 'white',
						flows: [{
							from : '||outerScope||',
							fromKey: 'color',
							toKey: 'color'
						}]
					}
				}]
			}]
		}}
	/>
);