import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ExternalComponent } from './library';

const CustomComponent = ExternalComponent(({ id, children, state, setState, Child }) => {
	const { genStyles, genClassNames, genAttributes } = state;

	useEffect(() => {
		(async () => {
			await new Promise(res => setTimeout(res, 5000));

			setState({
				childName: 'santino'
			});
		})();
	}, []);

	return (
		<div
			className={genClassNames}
			style={genStyles?.style}
			{...genAttributes}
		>
			{children}
			<Child mda={{
				//If no id is specified, this component will remount every time the parent's state changes
				id: `${id}-child`,
				type: 'label',
				prps: {
					caption: `I am named ${state.childName}`
				}
			}} />
		</div>
	);
});

const root = createRoot(document.getElementById('root'));

root.render(
	<CustomComponent
		state={{
			childName: 'shaun',
			display: 'flex',
			flexDirection: 'column'
		}}
	>
		{'I am a child that was passed in'}
	</CustomComponent>
);