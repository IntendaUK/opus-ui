const recurseFindNode = (props, data, cb) => {
	if (cb(data))
		return data;

	if (!data[props.state.childAtr])
		return;

	let f = null;
	for (let i = 0; i < data[props.state.childAtr].length; i++) {
		f = recurseFindNode(props, data[props.state.childAtr][i], cb);
		if (f)
			break;
	}

	return f;
};

export default recurseFindNode;
