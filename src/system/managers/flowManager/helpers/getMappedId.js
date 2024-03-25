//System Helpers
import { getScopedId } from '../../scopeManager';

//Exports
export const getMappedFrom = flow => {
	const { from, ownerId } = flow;

	if (!from || from.indexOf('||') !== 0)
		return from;

	const mappedFrom = getScopedId(from, ownerId);

	if (!flow.lateBound && mappedFrom !== from)
		flow.from = mappedFrom;

	return mappedFrom;
};

export const getMappedTo = flow => {
	const { to, ownerId } = flow;

	if (!to || to.indexOf('||') !== 0)
		return to;

	const mappedTo = getScopedId(to, ownerId);
	if (!flow.lateBound && mappedTo !== to)
		flow.to = mappedTo;

	return mappedTo;
};
