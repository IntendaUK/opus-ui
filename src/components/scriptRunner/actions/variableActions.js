//Helpers
import { getDeepPropertyArray } from '../../../system/helpers';

const getVariableKey = (scriptId, variableName) => {
	const key = `${scriptId}-${variableName}`;

	return key;
};

export const getVariable = (
	{ name, scope }, { id: scriptId }, { state: { variables } }
) => {
	const variableScope = scope ?? scriptId;
	const key = getVariableKey(variableScope, name);

	const result = variables[key];

	return result;
};

export const setVariable = (
	{ name, value, scope }, { id: scriptId }, { state: { variables } }
) => {
	const variableScope = scope ?? scriptId;
	const key = getVariableKey(variableScope, name);

	variables[key] = value;
};

export const setVariables = (
	{ variables: vars, scope }, { id: scriptId }, { state: { variables } }
) => {
	const variableScope = scope ?? scriptId;

	Object.entries(vars).forEach(([k, v]) => {
		const key = getVariableKey(variableScope, k);

		variables[key] = v;
	});
};

export const setVariableKey = ({ name, scope, key, value }, script, props) => {
	const variable = getVariable({
		name,
		scope
	}, script, props);

	const split = key.split('.');
	const propertyKey = split.pop();

	const property = getDeepPropertyArray(variable, split);

	property[propertyKey] = value;
};

export const setVariableKeys = ({ name, scope, keyValues }, script, props) => {
	const variable = getVariable({
		name,
		scope
	}, script, props);

	Object.entries(keyValues).forEach(([key, value]) => {
		const split = key.split('.');
		const propertyKey = split.pop();

		const property = getDeepPropertyArray(variable, split);

		property[propertyKey] = value;
	});
};

export const deleteVariableKey = ({ name, scope, key }, script, props) => {
	const variable = getVariable({
		name,
		scope
	}, script, props);

	const split = key.split('.');
	const propertyKey = split.pop();

	const property = getDeepPropertyArray(variable, split);

	if (property !== null || property !== undefined)
		delete property[propertyKey];
};

export const deleteVariable = (
	{ name, scope }, { id: scriptId }, { state: { variables } }
) => {
	const variableScope = scope ?? scriptId;
	const key = getVariableKey(variableScope, name);

	delete variables[key];
};

export const deleteVariables = (
	{ variables: vars, scope }, { id: scriptId }, { state: { variables } }
) => {
	const variableScope = scope ?? scriptId;

	vars.forEach(v => {
		const key = getVariableKey(variableScope, v);

		delete variables[key];
	});
};

export const pushVariable = (
	{ name, value, scope }, { id: scriptId }, { state: { variables } }
) => {
	const variableScope = scope ?? scriptId;
	const key = getVariableKey(variableScope, name);

	const array = variables[key] || [];
	array.push(value);

	variables[key] = array;
};

export const popVariable = (
	{ name, scope }, { id: scriptId }, { state: { variables } }
) => {
	const variableScope = scope ?? scriptId;
	const key = getVariableKey(variableScope, name);

	const variable = variables[key];

	if (!variable || !variable.pop)
		return;

	variable.pop();
};
