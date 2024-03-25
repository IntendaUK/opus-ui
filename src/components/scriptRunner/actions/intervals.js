//Helpers
import initAndRunScript from '../helpers/initAndRunScript';

//Actions
export const queueIntervalActions = ({ id, actions, delay }, script, props, context) => {
	const scriptId = id ?? script.id;

	const runner = async () => {
		await initAndRunScript({
			scriptId,
			script,
			scriptActions: actions,
			props,
			context
		});
	};

	const intervalId = setInterval(runner, delay);

	return intervalId;
};

export const cancelIntervalActions = ({ intervalId }) => {
	if (intervalId === 'undefined' || !intervalId)
		return;

	clearInterval(intervalId);
};
