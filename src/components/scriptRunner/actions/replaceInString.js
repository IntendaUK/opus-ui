//Action
const replaceInString = ({ value, replacements }) => {
	let res = value;

	replacements.forEach(r => {
		res = res.replaceAll(r.fromString, r.toString);
	});

	return value;
};

export default replaceInString;
