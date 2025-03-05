//React
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

//System
import Opus, { Component, ExternalComponent, OpusComponents } from './library';

import json from './stuff.json';

//Custom Component
const ContainerOuter = ExternalComponent(({ children, state }) => {
	const { genStyles, genClassNames, genAttributes } = state;

	return (
		<div
			className={genClassNames}
			style={genStyles?.style}
			{...genAttributes}
		>
			{'I am the outer container'}
			{children}
		</div>
	);
});

const onMountContainerInner = registerFlows => {
	registerFlows([{
		from: 'i2',
		toKey: 'backgroundColor'
	}]);
};

const ContainerInner = ExternalComponent(({ setState, setExtState, registerFlows, state }) => {
	const { genStyles, genClassNames, genAttributes } = state;

	useEffect(onMountContainerInner.bind(null, registerFlows), []);

	const onClickButton = () => {
		setState({
			backgroundColor: 'red'
		});
	};

	const onClickParentButton = () => {
		setExtState('||outer||', {
			backgroundColor: 'green'
		});
	};

	return (
		<div
			className={genClassNames}
			style={genStyles?.style}
			{...genAttributes}
		>
			{'  -- I am the inner container'}
			<button onClick={onClickButton}>
				Click me to change my background color
			</button>
			<button onClick={onClickParentButton}>
				Click me to change my parent background color
			</button>
		</div>
	);
});

const Input = ExternalComponent(({ setState, state }) => {
	const { genStyles, genClassNames, genAttributes, value = '' } = state;

	const setValue = e => {
		setState({ value: e.target.value });
	};

	return (
		<input
			className={genClassNames}
			style={genStyles?.style}
			{...genAttributes}
			onChange={setValue}
			value={value}
		/>
	);
});

const RendersMda = ExternalComponent(({ Child }) => {
	return (
		<div>
			<Child mda={json} />
		</div>
	);
});

//Setup
const root = createRoot(document.getElementById('root'));

root.render(
	<>
		<ContainerOuter id={'outer'} scope={'outer'} aflows={[{ from: 'i2', toKey: 'backgroundColor' }]}>
			<ContainerInner />
			<Input id={'i1'} />
			<Input id={'i2'} relId={'input'} scripts={[{
				triggers: [{
					event: 'onStateChange',
					source: 'i1'
				}],
				handler: ({ triggeredFrom, setState, setExtState, getVariable, getState, getStateExt }) => {
					console.log(triggeredFrom, getVariable('triggeredFrom'));

					setExtState('||outer.input||', {
						color: 'red'
					});
				}
			}]} />
			<RendersMda />
		</ContainerOuter>
	</>
);