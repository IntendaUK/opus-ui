//React
import React from 'react';

//System
import { stateManager } from '../stateManager';

//External Helpers
import { applyComparison } from '../../../components/scriptRunner/actions';
import morphConfig from '../../../components/scriptRunner/helpers/morphConfig';

//Mock props object
// We need this because morphConfig needs getWgtState and tries to destructure
// state into variables. We do not require variables for conditional traits though
// since we are not in the context of a script
const mockProps = {
	getWgtState: stateManager.getWgtState,
	state: {}
};

//Helper
const isConditionMet = (condition, scopeAnchorId) => {
	const tempCondition = { ...condition };
	if (React.isValidElement(tempCondition.value))
		tempCondition.value = true;

	const morphedCondition = morphConfig(tempCondition, { ownerId: scopeAnchorId }, mockProps);

	const { operator, source, key, value, compareValue, comparisons } = morphedCondition;

	const doesMatch = applyComparison({
		operator,
		source,
		key,
		value,
		compareValue,
		comparisons
	}, {}, mockProps);

	return doesMatch;
};

export default isConditionMet;
