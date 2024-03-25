//External Helpers
import { runScript } from './scriptRunner/interface';

//Helpers
import buildConditionActions from './buildConditionActions';

const applyRangeStyle = (
	setState,
	value,
	{ style, range: { min, max, color: colorName, variable } }
) => {
	const percentage = (value - min) / (max - min);
	const lightness = `calc(100% - ((100% - var(--${colorName}-l)) * ${percentage}))`;
	const color = `hsl(var(--${colorName}-hs), ${lightness})`;

	const newStyle = JSON.parse(
		JSON
			.stringify(style)
			.replace(variable, color)
	);

	setState({ styleOverrides: newStyle });
};

const applyConditionStyles = (setWgtState, id, value, conditions) => {
	const actions = buildConditionActions(id, value, conditions);

	runScript({
		id: 'format',
		ownerId: id,
		actions
	});
};

export const format = ({ id, setState, getWgtState, setWgtState, state: { formats, value } }) => {
	if (!formats)
		return;

	const srState = getWgtState('SCRIPTRUNNER');
	if (!srState)
		return;

	const branchConditions = [];
	formats.forEach(f => {
		if (f.range) {
			applyRangeStyle(setState, value, f);

			return;
		}

		branchConditions.push(f);
	});

	if (branchConditions.length)
		applyConditionStyles(setWgtState, id, value, branchConditions);
};
