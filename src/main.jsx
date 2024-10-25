//React
import { createRoot } from 'react-dom/client';

//System
import Opus, { Component, loadMdaPackage } from './library';

loadMdaPackage({
	path: 'trait',
	contents: {
		index: {
			prps: {
				width: '1%',
				height: '100%'
			}
		}
	}
});

//Setup
const root = createRoot(document.getElementById('root'));

const mda = {
	type: 'containerSimple',
	prps: {
		singlePage: true,
		backgroundColor: '#eee'
	},
	wgts: []
};

for (let i = 0; i < 100; i++) {
	const row = {
		type: 'containerSimple',
		prps: {
			dir: 'horizontal',
			height: '1%'
		},
		wgts: []
	};

	for (let j = 0; j < 100; j++) {
		row.wgts.push({
			type: 'containerSimple',
			traits: [{
				trait: 'trait/index',
				traitPrps: {}
			}],
			prps: {
				backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
			}
		});
	}

	mda.wgts.push(row);
}

const timeA = +new Date();

root.render(
	<Opus
		startupMda={mda}
	/>
);

const interval = setInterval(() => {
	if (document.querySelectorAll('.cpnContainerSimple').length === 10102) {
		clearInterval(interval);

		const timeB = +new Date();

		console.log(timeB - timeA);
	}
}, 100);