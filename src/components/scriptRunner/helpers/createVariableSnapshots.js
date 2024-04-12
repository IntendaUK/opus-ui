//System Helpers
import { clone } from '../../../system/helpers';

//Actions
import { setVariables } from '../actions/variableActions';

//Export
const createVariableSnapshots = (props, script, snapshotKeys, triggerMsg) => {
	const variables = Object.fromEntries(snapshotKeys.map(k => {
		let val = triggerMsg.full[k];

		if (typeof val === 'object')
			val = val instanceof Array ? clone([], val) : clone({}, val);

		return [`snapshot-${k}`, val];
	}));

	setVariables({ variables }, script, props);
};

export default createVariableSnapshots;
