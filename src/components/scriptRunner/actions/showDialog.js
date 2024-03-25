import { getKey } from '../../../system/wrapper/helpers';

const buildMdaButtons = (id, buttons, { id: { scriptId } }) => {
	const mdaButtons = buttons.map(({ cpt, onClick }, i) => {
		const fireScript = {
			id: scriptId,
			actions: [{
				type: 'setState',
				target: 'MODAL1',
				key: 'display',
				value: false
			}, ...onClick]
		};

		return {
			id,
			index: `button_${i}_${cpt}`,
			type: 'button',
			prps: {
				cpt,
				fireScript
			},
			auth: [ 'fireScript' ]
		};
	});

	return mdaButtons;
};

const buildMda = (id, action, script) => {
	const mda = {
		id,
		index: 'container',
		blueprint: 'system/dialog',
		heading: action.heading,
		message: action.msg,
		buttons: buildMdaButtons(id, action.buttons, script)
	};

	if (action.hasInput) {
		const inputIndex = 'input';
		const inputKey = getKey({
			id,
			index: inputIndex
		});

		Object.assign(mda, {
			blueprint: 'system/dialogWithInput',
			scriptId: script.id,
			inputIndex,
			inputKey,
			inputVariable: action.inputVariable
		});
	}

	return mda;
};

const showDialog = (action, script, { setWgtState }) => {
	const viewportId = `popup_${script.id}`;
	const inputMda = buildMda(viewportId, action, script);

	setWgtState('MODAL1', {
		display: true,
		inputMda
	});
};

export default showDialog;
