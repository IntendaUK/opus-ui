/* eslint-disable max-lines, max-lines-per-function, max-len, no-underscore-dangle */

//System
import opusConfig from '../../../config';

//System Helpers
import { clone, getDeepProperty } from '../../../system/helpers';
import { getScopedId } from '../../../system/managers/scopeManager';

//External Helpers
import { getFunctionResult } from '../functions/functionManager';

let morphConfig;

const getVariableValue = (splitToken, scope, variables) => {
	const [variableKey, ...variableSubKeys] = splitToken;

	const variableName = `${scope}-${variableKey}`;

	let value = variables[variableName];

	if (!variableSubKeys.length || !value)
		return value;

	if (variableSubKeys[0] === 'last')
		return value[value.length - 1];

	return getDeepProperty(value, variableSubKeys.join('.'));
};

const getScopedVariableValue = (splitToken, variables) => {
	const [scope, ...variableKeys] = splitToken;

	return getVariableValue(variableKeys, scope, variables);
};

const getStateValue = (splitToken, { ownerId }, getWgtState) => {
	const [sourceId, key, ...subKeys] = splitToken;

	const useSourceId = sourceId === 'self' ? ownerId : sourceId;

	const state = getWgtState(useSourceId);
	if (!state)
		return null;

	let value = state[key];

	if (!subKeys.length || !value)
		return value;

	return getDeepProperty(value, subKeys.join('.'));
};

//This function turns wildcards into their values
// Types of wildcards that can be caught:
//  state.targetId.key
//  state.targetId.key.subKey
//  state.self.key (targetId becomes ownerId)
//  state.self.key.subkey (targetId becomes ownerId)
//  variable.variableName
//  variable.variableName.subKey
//  variable.variableName.last (returns the last element of the variable if it's an array)

const getVariableOrState = (token, script, props, key, parentObj) => {
	const { getWgtState, state: { variables } } = props;

	const [tokenType, ...splitToken ] = token.split('.');

	if (tokenType === 'variable')
		return getVariableValue(splitToken, script.id, variables);
	else if (tokenType === 'scopedVariable')
		return getScopedVariableValue(splitToken, variables);
	else if (tokenType === 'eval') {
		let evalValue;

		const scp = splitToken.join('.');

		const _evalParameters = parentObj._evalParameters?.[key];

		try {
			//eslint-disable-next-line no-eval
			evalValue = eval(scp);
		} catch (e) {
			if (opusConfig.env === 'development') {
				console.error({
					msg: 'Evaluation crashed',
					error: e,
					args: {
						scp,
						evalParameters: JSON.parse(JSON.stringify(_evalParameters ?? {}))
					}
				});
			} else

				console.error('Evaluation crashed');
		}

		return evalValue;
	} else if (tokenType === 'fn') {
		const fnName = splitToken[0];
		const fnArgs = morphConfig(parentObj.fnArgs[key], script, props);

		morphConfig(fnArgs, script, props);

		const fnValue = getFunctionResult({
			name: fnName,
			args: fnArgs,
			dependencies: parentObj.fnDependencies
		});

		return fnValue;
	}

	const stateValue = getStateValue(splitToken, script, getWgtState);

	return stateValue;
};

export const fixScopeIds = (value, script, key, actionTrackers) => {
	let result = value;
	let newValue = value;

	do {
		result = newValue;

		newValue = newValue.replace(/\|\|[^(())>]*\|\|/g, match => {
			const scopedId = getScopedId(match, script.ownerId);

			if (actionTrackers) {
				actionTrackers.scopedIdLookups.push({
					key,
					scopedId: match,
					resolvedId: scopedId
				});
			}

			return scopedId;
		});

		newValue = newValue.replace(/\|\|[^{{}}>]*\|\|/g, match => {
			const scopedId = getScopedId(match, script.ownerId);

			if (actionTrackers) {
				actionTrackers.scopedIdLookups.push({
					key,
					scopedId: match,
					resolvedId: scopedId
				});
			}

			return scopedId;
		});
	} while (result !== newValue);

	return result;
};

const allowedTokens = ['variable', 'scopedVariable', 'state', 'eval', 'fn'];
//Returns an object { skip, string }
// When skip is true, string will not be provided
const shouldReplaceString = (string, scriptId, isDrilling, prefix, suffix) => {
	string = string.split(prefix).join('').split(suffix).join('');
	const tokens = string.split('.');

	const [ token0, token1 ] = tokens;

	const doReplace = (
		(
			token0 === scriptId &&
			allowedTokens.includes(token1)
		) ||
		(
			isDrilling &&
			allowedTokens.includes(token0)
		)
	);

	if (!doReplace)
		return { skip: true };

	if (token0 === scriptId)
		tokens.splice(0, 1);

	const result = {
		skip: false,
		string: tokens.join('.')
	};

	return result;
};

/* eslint-disable-next-line complexity */
const replaceStrings = (value, script, props, isDrilling, key, parentObj, actionTrackers) => {
	const scriptId = script.id;

	let result = value;
	let newValue = value;

	do {
		result = newValue;
		newValue = fixScopeIds(newValue, script, key, actionTrackers);

		for (let i = 0; i < newValue.length - 1; i++) {
			const c1 = newValue.substr(i, 2);
			let c1Type = ['((', '{{', '))', '}}'].indexOf(c1);
			if (c1Type === -1)
				continue;

			for (let j = i + 2; j < newValue.length - 1; j++) {
				const c2 = newValue.substr(j, 2);
				let c2Type = ['((', '{{', '))', '}}'].indexOf(c2);
				if (c2Type !== -1 && c2Type < 2)
					break;
				if (c2Type !== c1Type + 2)
					continue;

				const match = newValue.substring(i, j + 2);

				const { skip, string } = shouldReplaceString(match, scriptId, isDrilling, c1, c2);

				if (skip)
					break;

				let replacement = getVariableOrState(string, script, props, key, parentObj);

				if (c1 === '{{' && i === 0 && j === newValue.length - 2) {
					newValue = replacement;

					if (actionTrackers) {
						const fullAccessor = `{{${string}}}`;
						actionTrackers.accessors.push({
							key,
							accessor: fullAccessor,
							replacement: replacement ?? '{{undefined}}'
						});
					}

					return newValue;
				}

				if (c1 === '{{') {
					if (
						newValue.split('state.').length +
						newValue.split('variable.').length +
						newValue.split('eval.').length > 4
					) {
						if (!parentObj._evalParameters)
							parentObj._evalParameters = {};

						if (!parentObj._evalParameters?.[key])
							parentObj._evalParameters[key] = [];

						parentObj._evalParameters[key].push(replacement);

						const parameterAccessor = `_evalParameters[${parentObj._evalParameters[key].length - 1}]`;

						if (actionTrackers) {
							const fullAccessor = `{{${string}}}`;
							actionTrackers.evalParameters.push({
								key,
								parameterAccessor,
								accessor: fullAccessor,
								replacement
							});
						}

						replacement = parameterAccessor;
					} else {
						replacement = JSON.stringify(replacement)
							?.replaceAll('}}', ' } } ')
							.replaceAll('{{', ' { {  ');

						if (actionTrackers) {
							const fullAccessor = `{{${string}}}`;
							if (actionTrackers.accessors[fullAccessor] === undefined)
								actionTrackers.accessors[fullAccessor] = [];

							actionTrackers.accessors[fullAccessor].push(replacement);
						}
					}
				}

				newValue = newValue.substring(0, i) + replacement + newValue.substring(j + 2, newValue.length);

				if (actionTrackers) {
					const fullAccessor = `${c1}${string}${c2}`;
					if (actionTrackers.accessors[fullAccessor] === undefined)
						actionTrackers.accessors[fullAccessor] = [];

					actionTrackers.accessors[fullAccessor].push(newValue);
				}
			}
		}
	} while (result !== newValue);

	return result;
};

export const getMorphedValue = (value, script, props, isDrilling = false, key, parentObj, actionTrackers) => {
	let res = value;

	if (res.indexOf('((') > -1 || res.indexOf('{{') > -1 || res.indexOf('||') > -1)
		res = replaceStrings(value, script, props, isDrilling, key, parentObj, actionTrackers);

	if (isDrilling && typeof(res) === 'string' && res.includes('eval-')) {
		try {
			//eslint-disable-next-line no-eval
			res = eval(res.replace('eval-', ''));
		} catch (e) {
			console.error(`EVALUATION CRASHED: ${res}`);
		}
	}

	return res;
};

morphConfig = (config, script, props, forceDrill = false, isDrilling = true, actionTrackers) => {
	const isArray = config instanceof Array;
	const result = isArray ? [] : {};

	if (config.fnArgs && config.type !== 'invokeFunctionModule')
		result.fnArgs = config.fnArgs;

	/* eslint-disable-next-line complexity */
	Object.entries(config).forEach(([key, value]) => {
		if (value === undefined || value === null) {
			if (value === null)
				result[key] = value;

			return;
		}

		let newKey = key;
		let newValue = value;

		let isKeyDrilling = isDrilling;

		if (isKeyDrilling && !forceDrill && typeof(value) === 'object' && !isArray)
			isKeyDrilling = key[0] === '^';

		if (isKeyDrilling && key[0] === '^')
			newKey = key.substr(1);

		newKey = getMorphedValue(newKey, script, props, isDrilling, undefined, undefined, actionTrackers);

		if (actionTrackers && config.fnArgs?.[newKey] !== undefined) {
			actionTrackers.fnArgs.push({
				key,
				args: config.fnArgs[newKey]
			});
		}

		if (typeof(value) === 'object')
			newValue = morphConfig(value, script, props, forceDrill, isKeyDrilling, actionTrackers);
		else if (value.replace)
			newValue = getMorphedValue(value, script, props, isDrilling, newKey, result, actionTrackers);

		//We need a better way to define operations like this, because now we don't know if this should
		// be spread in the scope of the current script or perhaps some deeper script
		if (newKey === 'spread-' && isKeyDrilling)
			clone(result, newValue);
		else if (typeof(result[newKey]) === 'object' && result[newKey] !== null)
			clone(result[newKey], newValue);
		else
			result[newKey] = newValue;
	});

	return result;
};

export default morphConfig;
