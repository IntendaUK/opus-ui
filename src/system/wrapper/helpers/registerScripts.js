import { registerScripts as registerScriptsBase } from '../../../components/scriptRunner/interface';

const registerScripts = async ({ id, scps }) => {
	if (!scps)
		return;

	const registerQueue = scps.map(s => {
		return {
			id,
			script: s
		};
	});

	await registerScriptsBase(registerQueue);
};

export default registerScripts;
