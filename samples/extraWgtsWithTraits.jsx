//React
import { createRoot } from 'react-dom/client';

//System
import Opus, { loadMdaPackage } from './library';

//Setup
const root = createRoot(document.getElementById('root'));

loadMdaPackage({
	path: 'trait',
	contents: {
		index: {
			acceptPrps: {},
			type: 'containerSimple',
			prps: {
				padding: true,
				paddingSize: '6px',
				backgroundColor: '#666'
			},
			wgts: [{
				type: 'input',
				prps: {
					color: 'white',
					placeholder: '...',
					colorPlaceholder: 'white'
				}
			}]
		}
	}
});

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
				gap: '24px',
				recursivelyAssignExtraWgtIds: true,
				recursivelyApplyExtraWgtTraits: true
			},
			wgts: [{
				type: 'container',
				prps: {
					padding: true,
					backgroundColor: '#999',
					canClick: true,
					position: 'absolute',
					top: '48px',
					left: '50%',
					transform: 'translateX(-50%)',
					fireScript: {
						actions: [{
							type: 'setState',
							target: 'outer',
							key: 'extraWgts',
							value: [{
								traits: [{
									trait: 'trait/index',
									traitPrps: {}
								}]
							}]
						}]
					}
				}
			}, {
				type: 'container',
				prps: {
					padding: true,
					backgroundColor: '#999',
					canClick: true,
					position: 'absolute',
					bottom: '48px',
					left: '50%',
					transform: 'translateX(-50%)',
					fireScript: {
						id: 's',
						actions: [{
							type: 'setState',
							target: 'outer',
							key: 'deleteKeys',
							value: [{
								key: 'extraWgts',
								value: [{
									id: '{{s.state.outer.extraWgts.2.id}}'
								}]
							}]
						}]
					}
				}
			}]
		}}
	/>
);