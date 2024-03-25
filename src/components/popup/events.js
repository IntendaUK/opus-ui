import { bindEvents, unbindEvents } from './helpers';

export const onUnmount = (state, setState) => {
	const { eventsBound } = state;

	if (!eventsBound)
		return;

	unbindEvents(state, setState);
};

export const onMount = ({ state, setState }) => {
	return onUnmount.bind(this, state, setState);
};

export const onOptionClick = ({ setState, state: { handlerOnOptionClick } }, value) => {
	if (!value)
		return;

	setState({ display: false });

	if (handlerOnOptionClick)
		handlerOnOptionClick(value);
};

export const onBlur = ({ id, state, setState }, e) => {
	if (!state.display)
		return;

	//Did we click somewhere in the popup?
	let checkEl = e.target;
	while (checkEl !== document.body) {
		if (checkEl.id === id)
			return;

		checkEl = checkEl.parentNode;
	}

	unbindEvents({
		state,
		setState
	});

	setState({ display: false });
};

export const onDisplayChange = props => {
	const { setState, state: { display, eventsBound } } = props;

	if (display) {
		if (!eventsBound)
			bindEvents(props);

		return;
	}

	const deleteKeys = [
		'lookupPrps',
		'lookupData',
		'lookupDtaObj',
		'lookupFilters',
		'lookupWgts',
		'lookupStyleOverrides',
		'inputMda',
		'hidden'
	];

	setState({ deleteKeys });

	if (eventsBound)
		unbindEvents(props);
};
