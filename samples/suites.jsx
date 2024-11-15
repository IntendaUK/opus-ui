//React
import { createRoot } from 'react-dom/client';

//System
import Opus, { registerSuite, getScopedId } from './library';

//Setup
const root = createRoot(document.getElementById('root'));

//Suite Methods
const setBackgroundToRandomColor = ({ setState }) => {
	const backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

	setState({ backgroundColor });
};

const doWeirdStuffWithLabel = async ({ setState, getExternalState, getData, setData }) => {
	const baseCaption = getExternalState('outer').labelBaseCaption;

	const colors = ['red', 'blue', 'green'];
	const delayInMs = 1000;

	const runCount = getData('runCount', 0);
	const runCountInfo = `(Run count: ${runCount})`;
	setData('runCount', runCount + 1);

	for (let color of colors) {
		setState({
			color,
			caption: `${baseCaption} ${color} ${runCountInfo}`
		});

		await new Promise(res => setTimeout(res, delayInMs));
	}

	setState({
		tStartChangingColor: ~~(Math.random() * 999)
	});
};

const containerClick = ({ ownerId, getData, setData, setExternalState },  { args }) => {
	const idLabel = getScopedId('||clicker.label||', ownerId);

	let clickCount = getData('clickCount', 0);
	clickCount++;

	setExternalState(idLabel, {
		caption: `I have been clicked x ${clickCount} and the suffix is ${args.suffix}`
	});

	setData('clickCount', clickCount);
};

registerSuite({
	suite: 'colorManager',
	methods: {
		setBackgroundToRandomColor,
		doWeirdStuffWithLabel: {
			isAsync: true,
			handler: doWeirdStuffWithLabel
		},
		containerClick
	}
});

//Render
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
				labelBaseCaption: 'My color is',
				scps: [{
					suite: {
						suite: 'colorManager',
						method: 'setBackgroundToRandomColor'
					}
				}]
			},
			wgts: [{
				type: 'label',
				prps: {
					backgroundColor: 'black',
					paddingSize: '12px',
					scps: [{
						triggers: [{
							event: 'onMount'
						}, {
							event: 'onStateChange',
							key: 'tStartChangingColor'
						}],
						suite: 'colorManager.doWeirdStuffWithLabel'
					}]
				}
			}, {
				scope: 'clicker',
				type: 'container',
				prps: {
					canClick: true,
					fireScript: {
						suite: {
							suite: 'colorManager',
							method: 'containerClick',
							args: {
								suffix: 'some string'
							}
						}
					}
				},
				wgts: [{
					relId: 'label',
					type: 'label',
					prps: {
						caption: 'Click me',
						scps: [{
							actions: [{
								someConfig: 'bla',
								handler: ({ someConfig }, { ownerId }, { setWgtState }) => {
									setWgtState(ownerId, { caption: `My id is ${ownerId}...${someConfig}` })
								}
							}]
						}]
					}
				}]
			}]
		}}
	/>
);