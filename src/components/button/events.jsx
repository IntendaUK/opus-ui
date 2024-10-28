//External Helpers
import { runScript } from '../../library';

//Events
export const onClick = ({ setState }, e) => {
	e.stopPropagation();

	setState({ clicked: true });
};

export const onClickChanged = props => {
	const {
		id, setState, setWgtState,
		state: { clicked, handlerOnClick, open, close, lookup, fireScript }
	} = props;

	if (!clicked)
		return;

	if (fireScript) {
		fireScript.ownerId = id;
		runScript(fireScript);
	}

	if (handlerOnClick)
		handlerOnClick();
	else if (open) {
		setWgtState(open, {
			display: true,
			lookup
		});
	} else if (close)
		setWgtState(close, { display: false });

	setTimeout(() => {
		setState({ clicked: false });
	});
};
