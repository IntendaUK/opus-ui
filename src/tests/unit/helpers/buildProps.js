import { clone } from '../../../system/helpers';
import { applyPropSpec } from '../../../system/wrapper/helpers';

const getHandlerHelper = function (props, fn, ...rest) {
	return fn.bind(null, props, ...rest);
};

const buildProps = (baseProps, state = {}) => {
	const { type, propSpec } = baseProps;
	const newProps = {};

	const getHandler = getHandlerHelper.bind(null, newProps);

	const classNames = `cpn${type[0].toUpperCase()}${type.substr(1)}`;

	applyPropSpec(state, propSpec);

	clone(newProps, {
		setState: () => {},
		getWgtState: id => {
			if (id === 'app')
				return { token: 'testToken' };
		},
		ChildWgt: () => null,
		setWgtState: () => {},
		classNames,
		state: { },
		emit: () => {},
		flow: { next: () => {} },
		getHandler
	}, baseProps, { state });

	delete newProps.state.propSpec;

	return newProps;
};

export default buildProps;
