//System Helpers
import { clone } from '../../helpers';

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
