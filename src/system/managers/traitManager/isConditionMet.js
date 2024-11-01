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
	const morphedCondition = morphConfig(condition, { ownerId: scopeAnchorId }, mockProps);

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
