//System
import { Wrapper } from './wrapper';
import WrapperStatic from './wrapperStatic';

//System Helpers
import wrapWidgets from '../../components/wrapWidgets';
import { getFullPropSpec } from '../managers/componentManager';
import { applyPropSpec } from './helpers';
import { applyTraits } from '../managers/traitManager';
import generateClassNames from './helpers/generateClassNames';
import generateAttributes from './helpers/generateAttributes';
import generateStyles from './helpers/generateStyles';

//Internal
let ChildWgt;

//Helpers
const buildPropsStatic = mda => {
	const { id, type, wgts } = mda;

	if (mda.trait) {
		if (!mda.traits)
			mda.traits = [];

		mda.traits.push({
			trait: mda.trait,
			traitPrps: mda.traitPrps
		});

		delete mda.trait;
		delete mda.traitPrps;
	}

	while (mda.traits)
		applyTraits(mda, {});

	const propSpec = getFullPropSpec(type);

	const state = applyPropSpec(mda, propSpec);
	state.type = type

	const classNames = generateClassNames(state, propSpec);
	const attributes = generateAttributes(state);
	const styles = generateStyles(state, propSpec);

	const useWgts = wrapWidgets({
		ChildWgt: ChildWgt.bind(null, id),
		wgts
	});

	const res = {
		id,
		classNames,
		attributes,
		useWgts,
		...styles
	};

	return res;
};

//Component
ChildWgt = (parentId, props) => {
	const { mda, parentAndPathSet } = props;

	if (mda.isStatic) {
		const propsStatic = buildPropsStatic(mda);

		return <WrapperStatic key={propsStatic.id} {...propsStatic} />;
	}

	//Some components (like viewport) will set the parent and path manually
	if (mda && !parentAndPathSet)
		mda.parentId = parentId;

	return <Wrapper key={mda.id} {...props} />;
};

export default ChildWgt;
