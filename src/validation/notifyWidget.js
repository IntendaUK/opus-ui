const notifyWidget = ({ setState }, errors) => {
	const [{ error }] = errors;

	setState({
		hasError: true,
		error,
		errors
	});
};

export default notifyWidget;
