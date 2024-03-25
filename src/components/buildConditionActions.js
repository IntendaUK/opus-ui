const buildComparisonAction = (id, { condition, value: checkValue, style }, value) => {
	const action = {
		type: 'applyComparison',
		operator: condition,
		value: checkValue,
		compareValue: value,
		branch: {
			true: [{
				type: 'setState',
				target: id,
				key: 'styleOverrides',
				value: style
			}]
		}
	};

	return action;
};

const buildConditionActions = (id, value, conditions) => {
	const actions = [];
	let tracker = actions;

	conditions.forEach((condition, i) => {
		const action = buildComparisonAction(id, condition, value);
		tracker.push(action);

		if (i < conditions.length - 1) {
			action.branch.false = [];
			tracker = action.branch.false;
		} else {
			action.branch.false = [{
				type: 'setState',
				target: id,
				key: 'styleOverrides',
				value: {}
			}];
		}
	});

	return actions;
};

export default buildConditionActions;
