//Helpers
import initAndRunScript from '../helpers/initAndRunScript';

//Actions
export const queueIntervalActions = ({ id, actions, delay }, script, props) => {
	const scriptId = id ?? script.id;

	const runner = async () => {
		await initAndRunScript({
			scriptId,
			script,
			scriptActions: actions,
			props
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
