//Helpers
import { invokeFunctionModule as iFM } from '../functions/invokeFunctionModule';

//Action
const invokeFunctionModule = async ({ fnModule, fnArgs, dependencies }, { ownerId }) => {
	const res = iFM({
		name: fnModule,
		args: fnArgs,
		dependencies,
		ownerId
	});

	return res;
};

export default invokeFunctionModule;
