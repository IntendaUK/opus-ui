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

const getTrait = async key => {
	let trait = traits.get(key);

	if (!trait) {
		trait = await getMdaHelper({
			type: 'dashboard',
			key
		});

		setTrait(key, trait);
	}

	return clone({}, trait);
};

export const clearTraitCache = () => {
	traits.clear();
};

export default getTrait;
