//When the value changes, we close the grid
// Flows take care of sending the correct values to lookup fields
export const onGridValueChange = ({ setState }, value) => {
	if (!value)
		return;

	setState({ display: false });
};
