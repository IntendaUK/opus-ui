const mapToColor = (propVal, fullState, propConfig, themes) => {
	const { mapToTheme = 'colors' } = propConfig;

	const keyExists = themes?.[mapToTheme]?.[propVal] !== undefined;

	if (keyExists)
		return `var(--${mapToTheme}-${propVal})`;

	return propVal;
};

export default mapToColor;
