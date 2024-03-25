const splitString = ({ value, separator, removeWhitespace = false }) => {
	let result = value.split(separator);

	if (removeWhitespace) {
		result = result
			.join(' ')
			.split(/(\s+)/)
			.filter(string => string.trim().length > 0);
	}

	return result;
};

export default splitString;
