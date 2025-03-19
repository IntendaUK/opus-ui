//Internal
const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

//Helpers
export const getRandomString = (length = 5) => {
	let result = 'testrunner';
	for (let i = 0; i < length; i++)
		result += characters.charAt(Math.floor(Math.random() * characters.length));

	return result;
};
