const setVariableKeys = ({ name, value, keys }, { id: scriptId }, props) => {
	const key = `${scriptId}-${name}`;
	const obj = props.state[key] || {};
	let trackObj = obj;

	keys.forEach((k, i) => {
		if (i !== keys.length - 1) {
			if (!trackObj[k])
				trackObj[k] = {};

			trackObj = trackObj[k];
		} else
			trackObj[k] = value;
	});
	props.state.variables[key] = obj;
};

export default setVariableKeys;
