import React from 'react';
import { createRoot } from 'react-dom/client';
import Opus, { Component } from './library';

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

const Label = ({ state: { caption } }) => {
	return (
		<span>{caption}</span>
	);
};

const root = createRoot(document.getElementById('root'));

root.render(
	<Opus
		startupMda={{
			type: 'container',
			prps: {
				canClick: true,
				includeClickedArgs: ['mousePos'],
				fireScript: {
					actions: [{
						type: 'log',
						msg: '{{variable.clickedArgs}}'
					}]
				}
			},
			wgts: [{
				type: 'label',
				prps: {
					cpt: 'click me'
				}
			}]
		}}
	/>
);