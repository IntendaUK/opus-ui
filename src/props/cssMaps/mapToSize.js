import { getNodeNamespace } from '../../system/managers/scopeManager';
import { getNamespace } from '../../components/scriptRunner/actions/getMda/getMda';

const mapToSize = (propVal, fullState, propConfig, themes) => {
	let { mapToTheme = 'global' } = propConfig;

	if (!propVal.split)
		return propVal;

	const namespaceName = getNodeNamespace(fullState.id);
	if (namespaceName) {
		const namespace = getNamespace(namespaceName);
		mapToTheme = namespace.themeOverrides[mapToTheme] ?? mapToTheme;
	}

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
