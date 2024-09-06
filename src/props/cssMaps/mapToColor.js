import { getNodeNamespace, getNamespace } from '../../library';

const mapToColor = (propVal, fullState, propConfig, themes) => {
	let { mapToTheme = 'colors' } = propConfig;

	const namespaceName = getNodeNamespace(fullState.id);
	if (namespaceName) {
		const namespace = getNamespace(namespaceName);
		mapToTheme = namespace.themeOverrides[mapToTheme] ?? mapToTheme;
	}

	const keyExists = themes?.[mapToTheme]?.[propVal] !== undefined;

	if (keyExists)
		return `var(--${mapToTheme}-${propVal})`;

	return propVal;
};

export default mapToColor;
