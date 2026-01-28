const data = {};

export const get = (ownerId, key, defaultValue) => {
	if (!data[ownerId])
		data[ownerId] = { [key]: defaultValue };

       if (data[ownerId][key] === undefined)
               data[ownerId][key] = defaultValue;

	const res = data[ownerId][key];

	return res;
};

export const set = (ownerId, key, value) => {
	if (!data[ownerId]) {
		data[ownerId] = { [key]: value };

		return;
	}

	data[ownerId][key] = value;
};

export const clearForOwnerId = ownerId => {
	delete data[ownerId];
};
