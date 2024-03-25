//Helpers
import { defineFunction as dF } from '../functions/functionManager';

//Action
const defineFunction = async ({ name, acceptArgs, fn }) => {
	dF({
		name,
		acceptArgs,
		fn
	});
};

export default defineFunction;
