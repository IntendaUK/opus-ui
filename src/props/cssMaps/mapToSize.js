const mapToSize = (propVal, fullState, propConfig, themes) => {
	const { mapToTheme = 'global' } = propConfig;

	if (!propVal.split)
		return propVal;

	const result = propVal
		.split(' ')
		.map(val => {
			const keyExists = themes?.[mapToTheme]?.[val] !== undefined;

			if (keyExists)
				return `var(--${mapToTheme}-${val})`;

			return val;
		})
		.join(' ');

	return result;
};

export default mapToSize;
