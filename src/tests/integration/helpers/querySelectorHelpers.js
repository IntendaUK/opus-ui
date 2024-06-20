const isValidQuery = query => {
	try {
		document.querySelectorAll(query);

		return true;
	} catch (e) {
		return false;
	}
};

const cleanSelector = selector => {
	(selector.match(/(#[0-9][^\s:,]*)/g) || []).forEach(n => {
		selector = selector.replace(n, '[id="' + n.replace('#', '') + '"]');
	});

	return selector;
};

export const querySelector = query => {
	if (!isValidQuery(query))
		query = cleanSelector(query);

	return document.querySelector(query);
};

export const querySelectorAll = query => {
	if (!isValidQuery(query))
		query = cleanSelector(query);

	return document.querySelectorAll(query);
};
