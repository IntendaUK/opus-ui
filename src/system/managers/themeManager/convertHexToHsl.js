const convertHexToHsl = hex => {
	// Convert hex to RGB first
	let r = '0x' + hex[1] + hex[2];
	let g = '0x' + hex[3] + hex[4];
	let b = '0x' + hex[5] + hex[6];
	// Then to HSL
	r /= 255;
	g /= 255;
	b /= 255;
	let cmin = Math.min(r, g, b),
		cmax = Math.max(r, g, b),
		delta = cmax - cmin,
		h = 0,
		s = 0,
		l = 0;

	if (delta === 0)
		h = 0;
	else if (cmax === r)
		h = ((g - b) / delta) % 6;
	else if (cmax === g)
		h = (b - r) / delta + 2;
	else
		h = (r - g) / delta + 4;

	h = Math.round(h * 60);

	if (h < 0)
		h += 360;

	l = (cmax + cmin) / 2;
	s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
	s = +(s * 100).toFixed(1);
	l = +(l * 100).toFixed(1);

	return [h, s + '%', l + '%'];
};

export default convertHexToHsl;
