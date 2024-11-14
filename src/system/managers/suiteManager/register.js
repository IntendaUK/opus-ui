import { set as setInStore } from './store';

const register = ({ suite, methods, method, handler, isAsync = false }) => {
	if (methods) {
		Object.entries(methods).forEach(([k, v]) => {
			const { isAsync: isAsyncInner = false, handler: handlerInner = v } = v;

			setInStore({
				suite,
				method: k,
				handler: handlerInner,
				isAsync: isAsyncInner
			});
		});

		return;
	}

	setInStore({
		suite,
		method,
		handler,
		isAsync
	});
};

export default register;
