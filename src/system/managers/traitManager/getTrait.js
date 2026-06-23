//System Helpers
import { clone } from '../../helpers';

//Config
import opusConfig from '../../../config';

//External Helpers
import { getMdaHelper } from '../../../components/scriptRunner/actions/getMda/getMda';

//Cached
const traits = new Map();

//Helpers
export const setTrait = (name, trait) => {
	traits.set(name, trait);
};

const getTrait = key => {
	let trait = traits.get(key);

	if (!trait) {
		trait = getMdaHelper({
			type: 'dashboard',
			key
		});

		//A trait resolved here came from JSON metadata at runtime rather than a transpiled React
		// component. Warn in development to surface references the transpiler did not convert — but
		// only for COMPONENT traits (those that render a component, i.e. declare their own type).
		// Functional traits (behaviours with no type) are legitimately applied from metadata by the
		// runtime and would otherwise flood the console without being actionable.
		if (trait && trait.type !== undefined && opusConfig.env === 'development') {
			//eslint-disable-next-line no-console
			console.warn(`[opus-ui] Component-trait "${key}" was rendered from JSON metadata at runtime instead of a transpiled React component. The transpiler did not convert this reference (likely loaded via a viewport/modal/dashboard rather than a static trait usage).`);
		}

		if (!trait) {
			trait = {
				type: 'label',
				prps: { cpt: `Trait not found: ${key}` }
			};
		}

		setTrait(key, trait);
	}

	return clone({}, trait);
};

export const clearTraitCache = () => {
	traits.clear();
};

export default getTrait;
