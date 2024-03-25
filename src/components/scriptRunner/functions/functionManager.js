//System
import opusConfig from '../../../config';

//Function store
const functions = {};

//Helpers
export const defineFunction = ({ name, acceptArgs, fn, isModule }) => {
	if (isModule) {
		/* eslint-disable-next-line no-eval */
		fn = eval(fn);
		fn.init();
	}

	functions[name] = {
		acceptArgs,
		fn,
		isModule
	};
};

export const getFunction = name => {
	return functions[name];
};

export const getFunctionResult = ({ name, args }) => {
	let scp = functions[name].fn;

	Object.entries(args).forEach(([k, v], i) => {
		scp = scp
			.replaceAll(`$${k}$`, `_evalParameters[${i}]`)
			.replaceAll(`%${k}%`, v);
	});

	let evalValue;

	//eslint-disable-next-line no-unused-vars, no-underscore-dangle
	const _evalParameters = Object.values(args);

	try {
		//eslint-disable-next-line no-eval
		evalValue = eval(scp);
	} catch (e) {
		if (opusConfig.env === 'development') {
			//eslint-disable-next-line no-console
			console.error({
				msg: 'Function crashed',
				error: e,
				args: {
					scp,
					evalParameters: JSON.parse(JSON.stringify(_evalParameters))
				}
			});
		} else {
			/* eslint-disable-next-line no-console */
			console.error('Function crashed');
		}
	}

	return evalValue;
};
