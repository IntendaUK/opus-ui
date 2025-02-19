/* eslint-disable max-lines */

//This method is used for blueprints that define variable specs which should,
// going forward, be the standard way in which we use blueprints

//System Helpers
import { clone, cloneNoOverride, getDeepProperty } from '../../helpers';
import { resolveThemeAccessor } from '../../managers/themeManager';

//Helpers
import { getBlueprint, getVariableValue, getMorphedString } from '../blueprintManager';

export const applyPrpDefaults = (blueprintPrps, blueprintPrpSpec) => {
	Object.entries(blueprintPrpSpec).forEach(([k, v]) => {
		const { [k]: value } = blueprintPrps;
		const { dft, morph } = v;

		if (!morph && (value !== undefined || dft === undefined))
			return;

		blueprintPrps[k] = dft;
	});
};

export const findMissingPrps = (blueprintPrps, blueprintPrpSpec) => {
	const result = Object.entries(blueprintPrpSpec)
		.filter(([k, propDef]) => {
			const { [k]: definedValue } = blueprintPrps;

			if (definedValue !== undefined)
				return false;

			if (typeof (propDef) !== 'object' || propDef.required !== true)
				return false;

			return true;
		})
		.map(([k]) => k);

	return result;
};

const wildcardChars = ['%', '$'];
const isWildcard = key => {
	const firstIndex = wildcardChars.indexOf(key[0]);
	const lastIndex = wildcardChars.indexOf(key[key.length - 1]);

	const result = (
		firstIndex > -1 &&
		firstIndex === lastIndex
	);

	return result;
};

const deletePrpIfMissing = (key, value, blueprint, blueprintPrps, recurseConfig) => {
	//We never delete composite wildcards like %prefix%-%suffix%
	// Which is why we have the second check in this 'if'
	if (isWildcard(value) && value.split(value[0]).length === 3) {
		const prp = value.substring(1, value.length - 1);

		let prpName = prp.replace('...', '');
		prpName = prp.includes('.') ? prp.split('.')[0] : prp;

		if (
			recurseConfig?.ignoreUndefinedPrps === true &&
			recurseConfig.traitPrpSpec[prpName] === undefined
		)
			return false;

		let prpValue = blueprintPrps[prp];

		if (prp.includes('.'))
			prpValue = getDeepProperty(blueprintPrps, prp);

		if (prpValue === undefined) {
			delete blueprint[key];

			return true;
		}
	}

	return false;
};

export let recursivelyApplyValuePrps;

const applyValuePrp = (
	blueprint, blueprintPrps, recurseConfig, closestArrayAncestor, key, value
) => {
	const type = typeof (value);

	if (type === 'object' && value !== null) {
		recursivelyApplyValuePrps(value, blueprintPrps, recurseConfig, closestArrayAncestor);

		return;
	} else if (type !== 'string')
		return;

	const valuePrpDeleted = deletePrpIfMissing(key, value, blueprint, blueprintPrps, recurseConfig);

	if (valuePrpDeleted)
		return;

	const isDirectReplace = value[0] === '$' && value.slice(-1) === '$';

	let finalValue = (
		isDirectReplace ?
			getVariableValue(blueprint, value, blueprintPrps) :
			getMorphedString(value, blueprintPrps)
	);

	finalValue = resolveThemeAccessor(finalValue);

	if (value.indexOf('$...') === 0) {
		closestArrayAncestor.splice(key, 1, ...finalValue);

		return;
	} else if (key === 'spread-') {
		clone(blueprint, finalValue);
		delete blueprint[key];

		return;
	}

	blueprint[key] = finalValue;
};

/* eslint-disable-next-line max-lines-per-function, complexity */
recursivelyApplyValuePrps = (
	blueprint, blueprintPrps, recurseConfig, closestArrayAncestor
) => {
	let isArray = false;
	if (Array.isArray(blueprint)) {
		isArray = true;
		closestArrayAncestor = blueprint;
	}

	const entries = Object.entries(blueprint);

	if (isArray) {
		for (let key = 0; key < blueprint.length; key++) {
			const value = blueprint[key];

			applyValuePrp(blueprint, blueprintPrps, recurseConfig, closestArrayAncestor, key, value);
		}

		return;
	}

	for (const [key, value] of entries)
		applyValuePrp(blueprint, blueprintPrps, recurseConfig, closestArrayAncestor, key, value);
};

export const recursivelyApplyKeyPrps = (blueprint, blueprintPrps, recurseConfig) => {
	Object.keys(blueprint).forEach(key => {
		const keyPrpDeleted = deletePrpIfMissing(key, key, blueprint, blueprintPrps, recurseConfig);
		if (!keyPrpDeleted && isWildcard(key)) {
			const val = blueprint[key];
			let newKey = key[0] === '$'
				? getVariableValue(blueprint, key, blueprintPrps)
				: getMorphedString(key, blueprintPrps);

			newKey = resolveThemeAccessor(newKey);

			blueprint[newKey] = val;
			delete blueprint[key];
		}
	});
};

const applyBlueprints = mda => {
	if (mda.applyBlueprint === false) {
		delete mda.applyBlueprint;

		return;
	}

	let nextBptName = mda.blueprint;

	while (nextBptName) {
		delete mda.blueprint;

		const blueprintName = resolveThemeAccessor(nextBptName);
		const blueprint = getBlueprint(blueprintName);

		const blueprintPrpSpec = blueprint.acceptPrps;
		delete blueprint.acceptPrps;

		const blueprintPrps = mda.blueprintPrps;
		delete mda.blueprintPrps;

		applyPrpDefaults(blueprintPrps, blueprintPrpSpec);

		const missingPrps = findMissingPrps(blueprintPrps, blueprintPrpSpec);

		if (missingPrps.length) {
			// eslint-disable-next-line no-console
			console.log(`Missing blueprintPrps for ${mda.blueprint}: ${missingPrps.join(', ')}.`);

			return;
		}

		//Here we recurse over values first and then keys in a separate call otherwise we
		//could reach situations where key variables cannot be found
		recursivelyApplyValuePrps(blueprint, blueprintPrps);
		recursivelyApplyKeyPrps(blueprint, blueprintPrps);

		cloneNoOverride(mda, blueprint);

		nextBptName = mda.blueprint;
	}

	const entries = Object.entries(mda);

	for (const [, value] of entries) {
		if (typeof (value) !== 'object' || value === null)
			continue;

		applyBlueprints(value);
	}
};

export default applyBlueprints;
