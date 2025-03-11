//System Helpers
import opusConfig from '../../config';
import { cloneNoOverrideNoCopy, getDeepPropertyArray } from '../helpers';
import { recurseProps } from '../wrapper/helpers/morphProps';
import { applyPrpDefaults,
	findMissingPrps,
	recursivelyApplyValuePrps,
	recursivelyApplyKeyPrps } from './blueprintManager/applyBlueprintsNew';

//Helpers
import getTrait from './traitManager/getTrait';
import isConditionMet from './traitManager/isConditionMet';

//Helpers
const applyTraitProps = (trait, traitPrps, traitPath, mda) => {
	const traitPrpSpec = trait.acceptPrps;

	if (traitPrpSpec) {
		delete trait.acceptPrps;
		applyPrpDefaults(traitPrps, traitPrpSpec);

		const ignoreUndefinedPrps = trait.traitConfig?.ignoreUndefinedPrps ?? false;
		delete trait.traitConfig;

		/*
			Traits that contain the following:
				traitConfig: {
					ignoreUndefinedPrps: true
				}
			Won't have accessors like %x% replaced if 'x' isn't part of the trait's acceptPrps
		*/
		const recurseConfig = {
			traitPrpSpec,
			ignoreUndefinedPrps
		};

		let allowedToMorph = [];
		Object.entries(traitPrpSpec).forEach(([k, v]) => {
			if (!v.morph)
				return;

			allowedToMorph.push(k);
			traitPrps[k] = v;
		});
		recursivelyApplyValuePrps(traitPrps, traitPrps, recurseConfig);
		recursivelyApplyKeyPrps(traitPrps, traitPrps, recurseConfig);

		if (allowedToMorph.length > 0)
			recurseProps(mda.id, traitPrps, allowedToMorph);

		const missingPrps = findMissingPrps(traitPrps, traitPrpSpec);

		if (missingPrps.length) {
			// eslint-disable-next-line no-console
			console.log(`Missing traitPrps for ${traitPath}: ${missingPrps.join(', ')}.`);

			return;
		}

		//Here we recurse over values first and then keys in a separate call otherwise we
		//could reach situations where key variables cannot be found
		recursivelyApplyValuePrps(trait, traitPrps, recurseConfig);
		recursivelyApplyKeyPrps(trait, traitPrps, recurseConfig);
	}
};

//A list of array states that should be combined when combining traits and metadata
// In the future we should instead start calling setActions (when present)
const combineArrayProps = [
	'scps',
	'flows',
	'morphProps',
	'lookupFilters',
	'lookupFlows',
	'traitMappings'
];

export const combineTraitAndMda = (mda, trait, traitPath) => {
	if (opusConfig.env === 'development') {
		if (!mda.prps)
			mda.prps = {};

		if (!mda.prps.traitMappings)
			mda.prps.traitMappings = [];

		if (!mda.prps.traitMappings.includes(`dashboard/${traitPath}.json`))
			mda.prps.traitMappings.push(`dashboard/${traitPath}.json`);

		delete trait?.prps?.path;
	}

	if (mda.scope && trait.scope) {
		const combinedScope = Array.isArray(mda.scope) ? mda.scope : [ mda.scope ];
		if (Array.isArray(trait.scope)) {
			trait.scope.forEach(s => {
				if (!combinedScope.includes(s))
					combinedScope.push(s);
			});
		} else if (!combinedScope.includes(trait.scope))
			combinedScope.push(trait.scope);

		mda.scope = combinedScope;

		delete trait.scope;
	}

	combineArrayProps.forEach(p => {
		if (trait?.prps?.[p]?.length && mda?.prps?.[p]?.length) {
			mda.prps[p].push(...trait.prps[p]);

			delete trait.prps[p];
		}
	});

	if (trait?.prps?.['data-testid'] && mda.prps?.['data-testid']) {
		mda.prps['data-testid'] += ' | ' + trait.prps['data-testid'];

		delete trait.prps['data-testid'];
	}

	cloneNoOverrideNoCopy(mda, trait);
};

const deleteAuthFieldsFromMda = (mda, auth) => {
	auth.forEach(a => {
		const p = a.split('.');
		const l = p.pop();

		const f = getDeepPropertyArray(mda, p);
		if (f)
			delete f[l];
	});
};

export const applyTraits = mda => {
	const entries = Object.entries(mda);

	for (let [k, v] of entries) {
		if (k === 'traits') {
			delete mda[k];

			for (let t of v) {
				const { trait = t, traitPrps = {}, condition, auth } = t;

				if (condition) {
					const shouldApply = isConditionMet(condition, mda.parentId);

					if (!shouldApply)
						continue;
				}
				if (trait.includes('%') || trait.includes('$'))
					return;

				const clonedTraitMda = getTrait(trait);

				applyTraitProps(clonedTraitMda, traitPrps, trait, mda);

				applyTraits(clonedTraitMda);

				if (auth)
					deleteAuthFieldsFromMda(mda, auth);

				combineTraitAndMda(mda, clonedTraitMda, trait);
			}
		} else if (typeof(v) === 'object' && !!v && !v.traits)
			applyTraits(v);
	}
};

export const applyTraitsToArray = async mda => {
	for (let i = 0; i < mda.length; i++) {
		const t = mda[i];

		applyTraits(t);

		if (t.traitArray) {
			mda.splice(i, 1, ...t.traitArray);

			i--;
		}
	}
};
