//System
import { getThemes } from '../../managers/themeManager';

//Helpers
const generateAttr = (type, spec, prop, propVal, state) => {
	const { htmlAttr, htmlAttrVal } = spec;

	let attrName = htmlAttr;
	if (htmlAttr === true)
		attrName = prop;

	let attrVal = htmlAttrVal;
	if (htmlAttrVal === true)
		attrVal = propVal;
	if (typeof(htmlAttrVal) === 'function')
		attrVal = htmlAttrVal(propVal, state, spec, getThemes());

	return {
		attrName,
		attrVal
	};
};

const generateHtmlAttrs = (state, propSpec = {}) => {
	const { type } = state;

	const htmlAttrs = {};

	Object.entries(propSpec).forEach(([prop, spec]) => {
		const { [prop]: propVal } = state;
		if (propVal === undefined)
			return;

		const { htmlAttr } = spec;

		if (!htmlAttr)
			return;

		const generator = generateAttr;

		const { attrName, attrVal } = generator(type, spec, prop, propVal, state);

		htmlAttrs[attrName] = attrVal;
	});

	return htmlAttrs;
};

export default generateHtmlAttrs;
