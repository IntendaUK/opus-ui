//React
import React from 'react';

const applyTraits = ({ sysPrps = {}, prps = {}, traits = [] }) => {
	const arrayPrps = [
		'scps',
		'flows',
		'morphProps',
		'lookupFilters',
		'lookupFlows',
		'traitMappings'
	];

	const res = {
		...sysPrps,
		prps: {
			...prps
		}
	};

	traits.forEach(t => {
		const traitRes = t.type(t.traitPrps);

		if (!traitRes)
			return;

		if (res.scope && traitRes.scope) {
			const combinedScope = Array.isArray(res.scope) ? res.scope : [res.scope];

			if (Array.isArray(traitRes.scope)) {
				traitRes.scope.forEach(s => {
					if (!combinedScope.includes(s))
						combinedScope.push(s);
				});
			} else if (!combinedScope.includes(traitRes.scope))
				combinedScope.push(traitRes.scope);

			res.scope = combinedScope;

			delete traitRes.scope;
		}

		arrayPrps.forEach(p => {
			if (traitRes?.prps?.[p]?.length && res?.prps?.[p]?.length) {
				res.prps[p].push(...traitRes.prps[p]);

				delete traitRes.prps[p];
			}
		});

		if (traitRes?.prps)
			Object.assign(res.prps, traitRes.prps);

		Object.keys(traitRes).forEach(key => {
			if (key === 'prps')
				return;

			res[key] = traitRes[key];
		});
	});

	return res;
};

//A transpiled Opus component (tagged with isTranspiledComponent) can be referenced as a
// component-trait inside a dynamically-injected widget — e.g. a widget pushed into extraWgts by a
// script/handler. The transpiler emits such a reference as the imported component function rather
// than a trait-path string, so we render it directly as React instead of resolving JSON metadata.
const findComponentTraitIndex = traits => {
	if (!Array.isArray(traits))
		return -1;

	return traits.findIndex(t => {
		const candidate = t && (t.trait ?? t);

		return typeof(candidate) === 'function' && candidate.isTranspiledComponent;
	});
};

const wrapWidgets = ({ ChildWgt, wgts = [] }) => {
	const result = wgts.map(w => {
		if (!w.prps)
			w.prps = {};

		if (typeof(w.type) !== 'function') {
			const componentTraitIndex = findComponentTraitIndex(w.traits);

			if (componentTraitIndex > -1) {
				const componentTrait = w.traits[componentTraitIndex];
				const Type = componentTrait.trait ?? componentTrait;

				//Any remaining traits stay as functional traits (the { type, traitPrps } shape the
				// local applyTraits expects). String traits are left as-is for ChildWgt resolution.
				const otherTraits = w.traits
					.filter((_, idx) => idx !== componentTraitIndex)
					.map(t => {
						const candidate = t && (t.trait ?? t);

						if (typeof(candidate) === 'function')
							return { type: candidate, traitPrps: t?.traitPrps };

						return t;
					});

				const { type, traits, prps, traitPrps, ...sysRest } = w;

				const finalProps = {
					...applyTraits({
						sysPrps: {
							id: w.id,
							scope: w.scope,
							relId: w.relId
						},
						prps: prps ?? {},
						traits: otherTraits
					}),
					...sysRest,
					traitPrps: componentTrait.traitPrps ?? {}
				};

				return (
					<Type key={finalProps.id ?? w.id} {...finalProps} />
				);
			}
		}

		if (typeof(w.type) === 'function') {
			const { type: Type, ...rest } = w;

			if (!w.traits) {
				return (
					<Type key={w.id} {...rest} />
				);
			}

			const { prps, traits, ...otherRest } = rest;

			const finalProps = {
				...applyTraits({
					sysPrps: {
						id: w.id,
						scope: w.scope,
						relId: w.relId
					},
					prps,
					traits
				}),
				...otherRest
			};

			return (
				<Type key={finalProps.id} {...finalProps} />
			);
		}

		return (
			<ChildWgt
				key={w.id}
				mda={w}
			/>
		);
	});

	return result;
};

export default wrapWidgets;
