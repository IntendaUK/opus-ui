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
		let prpValue = blueprintPrps[prp];

		const prpName = prp.includes('.') ? prp.split('.')[0] : prp;
		if (
			recurseConfig?.ignoreUndefinedPrps === true &&
			recurseConfig.traitPrpSpec[prpName] === undefined
		)
			return false;

		if (prp.includes('.'))
			prpValue = getDeepProperty(blueprintPrps, prp);

		if (prpValue === undefined) {
			delete blueprint[key];

			return true;
		}
	}

	return false;
};

export const recursivelyApplyValuePrps = (blueprint, blueprintPrps, recurseConfig) => {
	const entries = Object.entries(blueprint);

	for (const [key, value] of entries) {
		const type = typeof (value);

		if (type === 'object' && value !== null) {
			recursivelyApplyValuePrps(value, blueprintPrps, recurseConfig);

			continue;
		} else if (type !== 'string')
			continue;

		const valuePrpDeleted = deletePrpIfMissing(key, value, blueprint, blueprintPrps, recurseConfig);

		if (valuePrpDeleted)
			continue;

		const isDirectReplace = value[0] === '$' && value.slice(-1) === '$';

		let finalValue = (
			isDirectReplace ?
				getVariableValue(blueprint, value, blueprintPrps) :
				getMorphedString(value, blueprintPrps)
		);

		finalValue = resolveThemeAccessor(finalValue);

		if (key === 'spread-') {
			clone(blueprint, finalValue);
			delete blueprint[key];

			continue;
		}

		blueprint[key] = finalValue;
	}
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

const applyBlueprints = async mda => {
	if (mda.applyBlueprint === false) {
		delete mda.applyBlueprint;

		return;
	}

	let nextBptName = mda.blueprint;

	while (nextBptName) {
		delete mda.blueprint;

		const blueprintName = resolveThemeAccessor(nextBptName);
		const blueprint = await getBlueprint(blueprintName);

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

		await applyBlueprints(value);
	}
};

export default applyBlueprints;
