const externalComponentTypes = [];

export const registerComponentTypes = componentTypes => {
	externalComponentTypes.push(...componentTypes);
};

export const getExternalComponentTypes = () => externalComponentTypes;
