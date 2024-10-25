import { generateClassNames as generatorBase } from '../../helpers';

const getClassMapEntries = (state, propSpec = {}) => {
	const entries = Object.entries(state)
		.map(([key, value]) => {
			const { classMap } = propSpec[key] || {};

			return {
				key,
				value,
				classMap
			};
		})
		.filter(({ classMap }) => classMap !== undefined);

	return entries;
};

const generateClassNames = ({ type, ...state }, propSpec = {}) => {
	const baseClass = `cpn${type[0].toUpperCase()}${type.substr(1)}`;

	const classMapEntries = getClassMapEntries(state, propSpec);

	const config = Object.fromEntries(
		classMapEntries.map(({ key, value, classMap }) => {
			if (typeof(classMap) === 'function') {
				const res = classMap(value, state);

				return [res, !!res];
			}

			let useClassName = classMap;
			let useValue = value;

			const isInverse = classMap[0] === '!';
			if (isInverse) {
				useClassName = classMap.substr(1);
				useValue = !value;
			} else if (useClassName === true)
				useClassName = key;

			const entry = [useClassName, useValue];

			return entry;
		})
	);

	let classNames = generatorBase(baseClass, config);
	if (state.classes)
		classNames += ' ' + state.classes;

	return classNames;
};

export default generateClassNames;
