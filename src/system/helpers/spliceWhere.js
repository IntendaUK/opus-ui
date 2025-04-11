const spliceWhere = (array, filter) => {
	for (let i = array.length - 1; i >= 0; i--) {
		if (filter(array[i], i, array))
			array.splice(i, 1);
	}
};

export default spliceWhere;
