const convertHexToRgb = hex => {
       // Expand shorthand hex codes (e.g., "#abc") to the full form "#aabbcc"
       // so the RGB conversion is consistent across browsers
       if (hex.length === 4 && hex[0] === '#')
               hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;

        const m = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);

	return [
		parseInt(m[1], 16),
		parseInt(m[2], 16),
		parseInt(m[3], 16)
	];
};

export default convertHexToRgb;
