import { clone, getDeepProperty } from '../helpers';

import { getMdaHelper } from '../../components/scriptRunner/actions/getMda/getMda';

import applyBlueprintsNew from './blueprintManager/applyBlueprintsNew';

const blueprints = new Map();

//Helpers
export const setBlueprint = (name, blueprint) => {
	blueprints.set(name, blueprint);
};

export const getBlueprint = name => {
	let blueprint = blueprints.get(name);
	if (blueprint)
		return clone({}, blueprint);

	blueprint = getMdaHelper({
		type: 'blueprint',
		key: name
	});
	setBlueprint(name, blueprint);

	return clone({}, blueprint);
};

export const getMorphedString = (string, blueprintVariables) => {
	const result = string
		.replace(/%(.*?)%/g, function (match, token) {
			const replacer = getDeepProperty(blueprintVariables, token);

			if (replacer === undefined)
				return match;

			return replacer;
		})
		.replace(/\$(.*?)\$/g, function (match, token) {
			const replacer = getDeepProperty(blueprintVariables, token);

			if (replacer === undefined)
				return match;

			return JSON.stringify(replacer);
		});

	return result;
};

export const getVariableValue = (mda, value, blueprintVariables) => {
	const variableName = value.split('$').join('');

	if (!variableName.includes('.')) {
		const { [variableName]: variableValue } = blueprintVariables;
		if (variableValue === undefined)
			return value;

		return variableValue;
	}

	const deepValue = getDeepProperty(blueprintVariables, variableName);
	if (deepValue === undefined)
		return value;

	return deepValue;
};

//If Object 'b' contains any keys that Object 'a' also has
// show a warning as this might cause unintended behavior
const notifyVariableOverrides = function (a, b) {
	const keysA = Object.keys(a);
	const keysB = Object.keys(b);

	const willOverride = keysB
		.filter(k => keysA.includes(k))
		.map(k => {
			const result = `[${k}] ${a[k]} -> ${b[k]}`;

			return result;
		});

	if (willOverride.length) {
		/* eslint-disable no-console */
		console.log('The following blueprint variables will be overridden', willOverride);
	}
};

export const applyBlueprints = (mda, blueprintVariables = {}) => {
	if (mda.blueprintPrps) {
		applyBlueprintsNew(mda);

		return;
	}

	if (mda.blueprint) {
		const blueprint = getBlueprint(mda.blueprint);

		notifyVariableOverrides(blueprintVariables, mda);

		delete mda.blueprint;

		blueprintVariables = clone({}, blueprintVariables, mda);
		clone(mda, blueprint);
	}

	const entries = Object.entries(mda);

	for (const [key, value] of entries) {
		const type = typeof (value);
		if (type === 'object' && value !== null) {
			applyBlueprints(value, blueprintVariables);

			continue;
		} else if (
			type !== 'string'
		)
			continue;

		if (value[0] === '$' && value.slice(-1) === '$')
			mda[key] = getVariableValue(mda, value, blueprintVariables);
		else
			mda[key] = getMorphedString(value, blueprintVariables);

		if (mda[key][0] === '&' && mda[key].slice(-1) === '&') {
			mda[key] = getBlueprint(mda[key].split('&').join(''));
			applyBlueprints(mda, blueprintVariables);
		}
	}
};
