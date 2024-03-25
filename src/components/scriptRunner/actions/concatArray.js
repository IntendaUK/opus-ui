const concatArray = config => {
	const { value, concatValue } = config;

	const result = value.concat(concatValue);

	return result;
};

export default concatArray;
