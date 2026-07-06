/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
//System Helpers
import opusConfig from '../../config';
import { clone, cloneNoOverrideNoCopy, getDeepPropertyArray } from '../helpers';
import { recurseProps } from '../wrapper/helpers/morphProps';
import { applyPrpDefaults,
	findMissingPrps,
	recursivelyApplyValuePrps,
	recursivelyApplyKeyPrps } from './blueprintManager/applyBlueprintsNew';

//Helpers
import getTrait from './traitManager/getTrait';
import getTranspiledTraitFn from './traitManager/getTranspiledTraitFn';
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

		//traitMappings tracks the JSON trait files a component uses (for dev hot-reload). Only a
		// path-string trait has such a file; a directly-imported trait module (function/object the
		// transpiler inlined) has none, so skip it rather than push a bogus `dashboard/[object Object].json`.
		if (typeof(traitPath) === 'string' && !mda.prps.traitMappings.includes(`dashboard/${traitPath}.json`))
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

				//A trait the transpiler resolved to a direct module import is a FUNCTION, not a path
				// string to look up in app.json. The transpiler emits it as either { trait: fn } or
				// { type: fn }. A FUNCTIONAL trait is called with its trait props and the returned
				// config merged in (mirroring wrapWidgets/applyNodeTraits), so it applies without any
				// JSON resolution. A COMPONENT trait (tagged isTranspiledComponent) is not mergeable
				// trait MDA — it is rendered directly when its widget is wrapped, so skip it here.
				const transpiledTraitFn = getTranspiledTraitFn(t);

				if (transpiledTraitFn) {
					if (!transpiledTraitFn.isTranspiledComponent) {
						const functionalTraitMda = transpiledTraitFn(traitPrps) || {};

						applyTraits(functionalTraitMda);

						if (auth)
							deleteAuthFieldsFromMda(mda, auth);

						combineTraitAndMda(mda, functionalTraitMda, transpiledTraitFn.name || 'transpiledTrait');
					}

					continue;
				}

				let clonedTraitMda = trait;

				//Don't try to fetch it if it's an object already
				// i.e. it might be traits: [ { type: { acceptPrps: {}, traitArray: [] } } ]
				if (typeof(trait) === 'string') {
					if (trait.includes('%') || trait.includes('$'))
						return;

					clonedTraitMda = getTrait(trait);
				} else if (typeof(trait) === 'object' && !!trait && Array.isArray(trait.traitArray)) {
					//A directly-imported SPREAD trait referenced as a BARE array element — i.e. the
					// transpiler rewrote `traits: ["@…/spreadTrait"]` into `traits: [<module>]`, where
					// <module> is the { acceptPrps, traitArray } object (no surrounding `trait:` key, so
					// `trait` defaulted to the element itself). getTranspiledTraitFn returns null for it
					// (it is neither a function nor { trait/type: fn }), so without this it would fall
					// through to clone({}, trait.type) — losing the traitArray entirely. Clone it directly
					// so combineTraitAndMda copies the traitArray onto mda and the surrounding
					// applyTraitsToArray can splice those actions in (same flow as the { trait: <module> }
					// shape below).
					clonedTraitMda = clone({}, trait);
				} else if (t.trait && typeof(t.trait) === 'object') {
					//A directly-imported trait module referenced as { trait: <module> } — e.g. a spread
					// trait { acceptPrps, traitArray } the transpiler rewrote from a path string into an
					// import. Apply the imported object directly instead of resolving it from app.json;
					// the same applyTraitProps + applyTraitsToArray (traitArray splice) flow then runs.
					clonedTraitMda = clone({}, t.trait);
				} else
					clonedTraitMda = clone({}, trait.type);

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
