//Store
const cache = [];

//Helpers
const getDelta = request => {
	const delta = JSON.stringify(request);

	return delta;
};

//For now, this helper should only be used by other actions
export const setCache = (request, value) => {
	const delta = getDelta(request);

	cache.push({
		req: delta,
		res: value
	});
};

//For now, this helper should only be used by other actions
export const getCache = request => {
	const delta = getDelta(request);

	const entry = cache.find(c => c.req === delta);

	return entry;
};

//This is the only action that should form part of scripts
export const clearActionCache = () => {
	cache.length = 0;
};
