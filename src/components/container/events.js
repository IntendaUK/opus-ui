import * as ReactDOM from 'react-dom';

export const onClick = ({ setState, state: { canClick, clicked } }, e) => {
	if (!canClick || clicked)
		return;

	e.stopPropagation();

	setState({ clicked: true });
};

export const onContext = ({ id, setWgtState, state: { contextMenu } }, e) => {
	if (!contextMenu)
		return;

	const { clientX: x, clientY: y } = e;

	const { items, mda } = contextMenu;

	setWgtState('CONTEXT1', {
		display: true,
		x,
		y,
		source: id,
		items,
		mda
	});

	e.preventDefault();
};

export const onMouseOver = ({ setState, state: { canHover, hovered } }) => {
	if (!canHover || hovered)
		return;

	ReactDOM.flushSync(() => {
		setState({ hovered: true });
	});
};

export const onMouseLeave = ({ setState, state: { canHover, hovered } }) => {
	if (!canHover || !hovered)
		return;

	ReactDOM.flushSync(() => {
		setState({ hovered: false });
	});
};
