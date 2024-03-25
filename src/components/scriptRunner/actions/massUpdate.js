const massUpdate = ({ gridId, column }, script, { getWgtState }) => {
	const massUpdateColumnValueId = `${gridId}-massUpdateColumnValue-${column}`;

	const { value } = getWgtState(massUpdateColumnValueId);
	const { filters } = getWgtState(gridId);

	// eslint-disable-next-line no-console
	console.log({
		column,
		value,
		filters
	});
};

export default massUpdate;
