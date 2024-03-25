//System Helpers
import { clone, cloneNoOverrideNoCopy, getDeepPropertyArray } from '../helpers';
import { recurseProps } from '../wrapper/helpers/morphProps';
import { applyPrpDefaults,
	findMissingPrps,
	recursivelyApplyValuePrps,
	recursivelyApplyKeyPrps } from './blueprintManager/applyBlueprintsNew';

//Helpers
import getTrait from './traitManager/getTrait';
import isConditionMet from './traitManager/isConditionMet';

//Helpers
const applyTraitProps = (trait, traitPrps, traitPath, mda, context) => {
	const traitPrpSpec = trait.acceptPrps;

	if (traitPrpSpec) {
		delete trait.acceptPrps;
		applyPrpDefaults(traitPrps, traitPrpSpec);

		let allowedToMorph = [];
		Object.entries(traitPrpSpec).forEach(([k, v]) => {
			if (!v.morph)
				return;

			allowedToMorph.push(k);
			traitPrps[k] = v;
		});
		recursivelyApplyValuePrps(traitPrps, traitPrps);
		recursivelyApplyKeyPrps(traitPrps, traitPrps);

		if (allowedToMorph.length > 0)
			recurseProps(mda.id, traitPrps, context, allowedToMorph);

		const missingPrps = findMissingPrps(traitPrps, traitPrpSpec);

		if (missingPrps.length) {
			// eslint-disable-next-line no-console
			console.log(`Missing traitPrps for ${traitPath}: ${missingPrps.join(', ')}.`);

			return;
		}

		//Here we recurse over values first and then keys in a separate call otherwise we
		//could reach situations where key variables cannot be found
		recursivelyApplyValuePrps(trait, traitPrps);
		recursivelyApplyKeyPrps(trait, traitPrps);
	}
};

//A list of array states that should be combined when combining traits and metadata
// In the future we should instead start calling setActions (when present)
const combineArrayProps = [
	'scps',
	'flows',
	'morphProps',
	'lookupFilters',
	'lookupFlows'
];

export const combineTraitAndMda = (mda, trait) => {
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

export const applyTraits = async (mda, context) => {
	const entries = Object.entries(mda);

	for (let [k, v] of entries) {
		if (k === 'traits') {
			delete mda[k];

			for (let t of v) {
				const { trait = t, traitPrps = {}, condition, auth } = t;

				if (condition) {
					const shouldApply = await isConditionMet(condition, mda.parentId);

					if (!shouldApply)
						continue;
				}
				if (trait.includes('%') || trait.includes('$'))
					return;

				const traitMda = await getTrait(trait);

				const clonedTraitMda = clone({}, traitMda);

				applyTraitProps(clonedTraitMda, traitPrps, trait, mda, context);

				await applyTraits(clonedTraitMda, context);

				if (auth)
					deleteAuthFieldsFromMda(mda, auth);

				combineTraitAndMda(mda, clonedTraitMda);
			}
		} else if (typeof(v) === 'object' && !!v && !v.traits)
			await applyTraits(v, context);
	}
};

export const applyTraitsToArray = async (mda, context) => {
	for (let i = 0; i < mda.length; i++) {
		const t = mda[i];

		await applyTraits(t, context);

		if (t.traitArray) {
			mda.splice(i, 1, ...t.traitArray);

			i--;
		}
	}
};
