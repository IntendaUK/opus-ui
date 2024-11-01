/* eslint-disable max-lines, max-lines-per-function */

//React
import React, { useState, useEffect, useCallback } from 'react';

//System Helpers
import { clone } from '../helpers';
import { doesComponentTypeExist } from '../managers/componentManager';

//External Helpers
import { generateGuid } from '../helpers';
import { applyBlueprints } from '../managers/blueprintManager';
import { applyTraits } from '../managers/traitManager';
import isConditionMet from '../managers/traitManager/isConditionMet';

//Components
import WrapperInner from './wrapperInner';

//Helpers
const getErrorCaption = ({ id, type }) => {
	if (!type)
		return `No component type was provided for component: ${id}`;
	else if (!doesComponentTypeExist(type))
		return `Component type unsupported: ${type}`;

	return null;
};

const applyErrorProps = (mda, cpt) => {
	clone(mda, {
		type: 'label',
		prps: {
			cpt,
			wrapAction: 'pre'
		}
	});
};

//The 'isFirstLevel' property is used to discern if the metadata we're looking at is the
// component being mounted right now, or some child component. We should only apply traits
// for components that are being mounted right now
const recurseMutateMda = mda => {
	while (mda.blueprint)
		applyBlueprints(mda);

	if (!mda.id)
		mda.id = generateGuid();

	if (mda.index !== undefined) {
		mda.id = `${mda.id}-${mda.index}`;
		delete mda.index;
	}

	//Here, we return so we dont drill into grid wgts which are columns
	// otherwise the grid cols will be mutated
	if (['grid', 'tabContainer'].includes(mda.type))
		return;

	if (mda.wgts) {
		mda.wgts.spliceWhere(w => typeof(w) !== 'object' || w === null);
		for (const wgtMda of mda.wgts)
			recurseMutateMda(wgtMda);
	}
};

//Events
export const onMutateMda = (initialMda, mdaString, setFixedMda, ctx) => {
	const mda = clone({}, initialMda);

	if (mda.applyBlueprint === false)
		delete mda.applyBlueprint;
	else {
		if (mda.trait) {
			if (!mda.traits)
				mda.traits = [];

			mda.traits.push({
				trait: mda.trait,
				traitPrps: mda.traitPrps
			});

			delete mda.trait;
			delete mda.traitPrps;
		}

		while (mda.traits)
			applyTraits(mda, ctx);

		if (mda.condition) {
			const conditionMet = isConditionMet(mda.condition, mda.parentId);
			if (conditionMet === false)
				return;
		}

		recurseMutateMda(mda);

		const errorCaption = getErrorCaption(mda);
		if (errorCaption) {
			applyErrorProps(mda, errorCaption);

			return;
		}
	}

	setFixedMda({
		mda,
		mdaString
	});
};

//Components
const WrapperDynamic = React.memo(
	({ mda, children, ctx, mdaString }) => {
		const [fixedMda, setFixedMda] = useState(null);

		const onFixMda = useCallback(
			onMutateMda.bind(null, mda, mdaString, setFixedMda, ctx),
			[mdaString]
		);
		useEffect(onFixMda, [mdaString]);

		if (!fixedMda)
			return null;

		const { mda: useMda, mdaString: useMdaString } = fixedMda;

		return (
			<WrapperInner
				key={useMda.id}
				mdaString={useMdaString}
				mda={useMda}
				children={children}
				ctx={ctx}
			/>
		);
	},
	({ mdaString: mdaStringA }, { mdaString: mdaStringB }) => {
		return mdaStringA === mdaStringB;
	}
);

export default WrapperDynamic;
