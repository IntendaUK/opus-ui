import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Opus, { ThemedComponent, loadEnsemble, buildThemes, applyThemesToMdaPackage, getMdaPackage } from './library';

const onMount = () => {
	loadEnsemble({
		name: 'a',
		ensemble: {
			dashboard: {},
			themes: {
				'a.json': {
					b: '#FF0000'
				}
			}
		}
	});

	buildThemes({ themes: ['a'], themeSets: [] })

	const mdaPackage = getMdaPackage();
	applyThemesToMdaPackage(mdaPackage);
};

const OpusUI = () => {
	useEffect(onMount, []);

	return (
		<div>
			<ThemedComponent mda={{
				type: 'container',
				prps: {
					canClick: true,
					fireScript: {
						actions: [{
							type: 'setState',
							key: 'extraWgts',
							value: [{
								type: 'label',
								prps: {
									caption: 'yo',
									backgroundColor: '{theme.a.b}'
								}
							}]
						}]
					}
				},
				wgts: [{
					type: 'label',
					prps: {
						caption: 'click me'
					}
				}]
			}} />
		</div>
	);
};

const Label = ({ state: { caption } }) => {
	return (
		<span>{caption}</span>
	);
};

const root = createRoot(document.getElementById('root'));

root.render(
	<Opus
		startupComponent={<OpusUI />}
		registerComponentTypes={[{
			type: 'label',
			component: Label,
			propSpec: {
				caption: {
					type: 'string',
					dft: ''
				}
			}
		}]}
	/>
);