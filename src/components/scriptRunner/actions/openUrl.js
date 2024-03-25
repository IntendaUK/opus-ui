const openUrl = ({ url: urlToOpen }, script, { getWgtState, setWgtState }) => {
	let url = urlToOpen;

	if (url.includes('#TOKEN#')) {
		const { token } = getWgtState('app');

		if (!token) {
			setWgtState('NOTIFICATIONS', {
				newMsg: {
					msg: 'User isn\'t logged in so token doesn\'t exist',
					type: 'danger'
				}
			});

			return;
		}

		url = url.replace('#TOKEN#', token);
	}

	window.open(url);
};

export default openUrl;
