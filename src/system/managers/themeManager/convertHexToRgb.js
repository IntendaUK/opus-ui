const convertHexToRgb = hex => {
	if (hex.length < 7)
		hex = hex.padEnd(7, '0');

	const m = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);

	return [
		parseInt(m[1], 16),
		parseInt(m[2], 16),
		parseInt(m[3], 16)
	];
};

export default convertHexToRgb;
