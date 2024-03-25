const showNotification = (config, scriptId, { setWgtState }) => {
	const {
		target = 'NOTIFICATIONS',
		msgType: type = 'info',
		autoClose = true,
		isGlobal = false,
		msg,
		duration
	} = config;

	setWgtState(target, {
		newMsg: {
			msg,
			type,
			autoClose,
			isGlobal,
			duration
		}
	});
};

export default showNotification;
