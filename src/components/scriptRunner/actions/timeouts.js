//Helpers
import initAndRunScript from '../helpers/initAndRunScript';

//Actions
export const queueDelayedActions = ({ id, actions, delay }, script, props) => {
	const scriptId = id ?? script.id;

	const runner = async () => {
		await initAndRunScript({
			scriptId,
			script,
			scriptActions: actions,
			props
		});
	};

	const delayId = setTimeout(runner, delay);

	return delayId;
};

export const cancelDelayedActions = async ({ delayId }) => {
	if (delayId === 'undefined' || !delayId)
		return;

	clearTimeout(delayId);
};
