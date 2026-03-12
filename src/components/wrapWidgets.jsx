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

const wrapWidgets = ({ ChildWgt, wgts = [] }) => {
	const result = wgts.map((w, i) => {
		if (!w.prps)
			w.prps = {};

		w.prps.indexInParent = i;

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
