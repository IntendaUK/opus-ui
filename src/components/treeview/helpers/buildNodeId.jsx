const buildNodeId = ({ id, state: { disAtr, dtaAtr, patAtr } }, d) => {
	return `${id}-${d[patAtr]}-${d[dtaAtr]}-${d[disAtr]}`;
};

export default buildNodeId;
