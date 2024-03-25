let nextScriptId = 1;

const getNextScriptId = () => {
	const i = nextScriptId++;
	const result = `generatedScriptId_${i}`;

	return result;
};

export default getNextScriptId;
