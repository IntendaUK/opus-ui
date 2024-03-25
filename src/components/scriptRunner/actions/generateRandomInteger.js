const generateRandomInteger = async ({ min, max }) => {
	const result = min + ~~(Math.random() * (max - min + 1));

	return result;
};

export default generateRandomInteger;
