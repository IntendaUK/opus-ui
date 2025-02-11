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
			acceptPrps: {
				singleComponent: {
					type: 'component',
					desc: 'An extra component to render'
				},
				singleComponentWithinSubkey: {
					type: 'component',
					desc: 'An object containing a component within its "inner" key'
				},
				multipleComponents: {
					type: 'component',
					desc: 'An array of extra components to render'
				},
				multipleComponentsWithinSubkey: {
					type: 'object',
					desc: 'An object containing a component array within its "inner" key'
				},
				notPassedIn: {
					type: 'string',
					desc: 'A property that will not be passed in, as a test'
				}
			},
			type: 'containerSimple',
			prps: {
				padding: true,
				paddingSize: '6px',
				gap: '24px'
			},
			wgts: [
				{
					type: 'label',
					prps: {
						cpt: 'I should be first'
					}
				},
				'$...multipleComponents$',
				'$...multipleComponentsWithinSubkey.inner$',
				{
					type: 'label',
					prps: {
						cpt: 'My state should not contain "abc"',
						abc: '%notPassedIn%'
					}
				},
				{
					type: 'label',
					prps: {
						cpt: 'I should be third last'
					}
				},
				'$singleComponent$',
				'$singleComponentWithinSubkey.inner$'
			]
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
				backgroundColor: '#fafafa'
			},
			wgts: [{
				traits: [{
					trait: 'trait/index',
					traitPrps: {
						singleComponent: {
							type: 'label',
							prps: {
								cpt: 'I was added as a single component into an array'
							}
						},
						singleComponentWithinSubkey: {
							inner: {
								type: 'label',
							prps: {
								cpt: 'I was also added as a single component into an array'
							}
							}
						},
						multipleComponents: [{
							type: 'label',
							prps: {
								cpt: 'I was added by spreading into an array (1)'
							}
						}],
						multipleComponentsWithinSubkey: {
							inner: [{
								type: 'label',
								prps: {
									cpt: 'I was added by spreading into an array (2)'
								}
							}]
						}
					}
				}]
			}]
		}}
	/>
);