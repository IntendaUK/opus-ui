import { createRoot } from 'react-dom/client';

import Opus, { ContainerSimple, Label, ExternalComponent } from './library';

const CaptionTrait = {
	prps: {
		caption: 'spoon'
	}
};

const LabelTrait = {
	type: 'label',
	prps: {
		caption: 'banana'
	}
}

const Component = ExternalComponent(() => {
	return (
		<ContainerSimple>
			<Label
				id={'label'}
				prps={{
					caption: 'yo'
				}}
			/>
			<Label
				traits={[{
					trait: CaptionTrait,
					traitPrps: {}
				}]}
			/>
			{ExternalComponent()({ traits: [{ trait: LabelTrait, traitPrps: {} }]})}
		</ContainerSimple>
	);
});


//Setup
const root = createRoot(document.getElementById('root'));

root.render(
	<Opus
		startupComponent={<Component />}
	/>
);