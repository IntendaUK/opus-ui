const action = ({ on }) => {
	const elRoot = document.getElementById('root');
	const hasDebug = elRoot.classList.contains('debug');

	const ignore = (
		(
			on === true &&
			hasDebug
		) ||
		(
			on === false &&
			!hasDebug
		)
	);
	if (ignore)
		return;

	if (on === true || (on === undefined && !hasDebug))
		elRoot.classList.add('debug');
	else if (on === false || (on === undefined && hasDebug))
		elRoot.classList.remove('debug');
};

export default action;
