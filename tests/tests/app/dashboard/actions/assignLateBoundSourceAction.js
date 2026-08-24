const assignLateBoundSourceAction = ({ getState, setState }) => {
	const { fireScriptOptions } = getState();

	setState({ fireScript: fireScriptOptions.primary });
};

export default assignLateBoundSourceAction;
