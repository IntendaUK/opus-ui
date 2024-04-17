const externalDataLocations = {};

export const registerExternalDataLocations = externalDataLocationsList => {
	externalDataLocationsList.forEach(({ type, handler }) => {
		externalDataLocations[type] = handler;
	});
};

export const getExternalDataLocation = type => {
	return externalDataLocations[type];
};

export const getExternalDataLocations = () => externalDataLocations;
