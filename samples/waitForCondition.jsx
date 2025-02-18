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
				backgroundColor: '#fafafa'
			},
			wgts: [{
				type: 'label',
				prps: {
					caption: 'Delayed component is not mounted yet',
					backgroundColor: 'red',
					scps: [{
						actions: [{
							type: 'waitForCondition',
							intervalInMs: 100,
							condition: {
								operator: 'isTruthy',
								value: '{{state.delayedComponent.type}}'
							}
						}, {
							type: 'setMultiState',
							value: {
								caption: 'Delayed component has been mounted!',
								backgroundColor: 'green'
							}
						}]
					}]
				}
			}, {
				id: 'inner',
				type: 'container',
				prps: {
					scps: [{
						actions: [{
							type: 'wait',
							duration: 3000
						}, {
							type: 'setState',
							key: 'extraWgts',
							value: [{
								id: 'delayedComponent',
								type: 'label',
								prps: {
									caption: 'I\'m late, but I\'m here!'
								}
							}]
						}]
					}]
				}
			}]
		}}
	/>
);