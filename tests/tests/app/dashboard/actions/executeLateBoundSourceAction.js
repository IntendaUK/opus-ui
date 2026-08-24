const executeLateBoundSourceAction = ({ setExternalState }) => {
	setExternalState('lateBoundSourceActionResult', { caption: 'Success' });
};

export default executeLateBoundSourceAction;
