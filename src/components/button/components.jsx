//React
import React, { useContext } from 'react';

//System
import { createContext } from '../../system/managers/appManager';

//Context
const ButtonContext = createContext('button');

//Components
export const TextComponent = () => {
	const { id, ChildWgt, state: { cpt, prpsLabel } } = useContext(ButtonContext);

	if (!prpsLabel?.cpt && !cpt)
		return null;

	const prps = {
		cpt,
		...prpsLabel
	};

	const auth = Object.keys(prps);

	return (
		<ChildWgt mda={{
			id: `${id}-label`,
			type: 'label',
			prps,
			auth
		}} />
	);
};

export const IconComponent = () => {
	const { id, ChildWgt, state: { prpsIcon } } = useContext(ButtonContext);

	if (!prpsIcon)
		return null;

	return (
		<ChildWgt mda={{
			id: `${id}-icon`,
			type: 'icon',
			prps: prpsIcon,
			auth: Object.keys(prpsIcon)
		}} />
	);
};

export const BadgeComponent = () => {
	const { id, ChildWgt, state: { hasBadge, badgeValue } } = useContext(ButtonContext);

	if (!hasBadge)
		return null;

	return (
		<ChildWgt mda={{
			id,
			index: 'badge',
			type: 'badge',
			prps: { badgeValue }
		}} />
	);
};
