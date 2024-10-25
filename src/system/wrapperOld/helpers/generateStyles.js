//System
import { getThemes } from '../../managers/themeManager';

//Helpers
const generateVar = (type, spec, prop, propVal, state) => {
	const { cssVar, cssVarVal } = spec;

	let varName = `--${type}-`;
	if (cssVar === true)
		varName += prop;
	else
		varName += cssVar;

	let varVal = propVal;
	if (cssVarVal === true)
		varVal = propVal;
	else if (typeof(cssVarVal) === 'function')
		varVal = cssVarVal(propVal, state, spec, getThemes());

	if (varVal === undefined)
		return;

	return {
		varName,
		varVal
	};
};

const generateAttr = (type, spec, prop, propVal, state) => {
	const { cssAttr, cssAttrVal } = spec;

	let varName = cssAttr;
	if (cssAttr === true)
		varName = prop;

	let varVal = cssAttrVal;
	if (cssAttrVal === true)
		varVal = propVal;
	if (typeof(cssAttrVal) === 'function')
		varVal = cssAttrVal(propVal, state, spec, getThemes());

	if (varVal === undefined)
		return;

	return {
		varName,
		varVal
	};
};

const generateCustomCssVars = (state, styleObjects) => {
	const { cssVars } = state;

	if (!cssVars)
		return;

	if (!styleObjects.style)
		styleObjects.style = {};

	cssVars.forEach(({ name, value, propertyValue }) => {
		let useValue = value;
		if (propertyValue)
			useValue = state[propertyValue];

		const useName = `--${name}`;

		styleObjects.style[useName] = useValue;
	});
};

const generateStyles = (state, propSpec = {}) => {
	const { type } = state;

	const styleObjects = {};

	Object.entries(propSpec).forEach(([prop, spec]) => {
		const { cssVar, cssAttr, cssVarGroup = 'style' } = spec;
		if (!cssVar && !cssAttr)
			return;

		const { [prop]: propVal } = state;
		if (propVal === undefined)
			return;

		const generator = cssVar ? generateVar : generateAttr;

		const result = generator(type, spec, prop, propVal, state);

		if (result === undefined)
			return;

		const { varName, varVal } = result;

		if (!styleObjects[cssVarGroup])
			styleObjects[cssVarGroup] = {};

		styleObjects[cssVarGroup][varName] = varVal;
	});

	generateCustomCssVars(state, styleObjects);

	return styleObjects;
};

export default generateStyles;
