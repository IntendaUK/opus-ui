import * as ReactDOM from 'react-dom';

export const onClick = ({ setState, state: { canClick, clicked, includeClickedArgs } }, e) => {
	if (!canClick || clicked)
		return;

	e.stopPropagation();

	const newState = { clicked: true };

	if (includeClickedArgs?.includes('mousePos')) {
		newState.clickedArgs = {
			mousePos: {
				x: e.clientX,
				y: e.clientY
			}
		};
	}

	setState(newState);
};

export const onContext = ({ id, setState, setWgtState, state: { contextMenu } }, e) => {
	if (!contextMenu)
		return;

	const { items, mda, itemHeight, stopPropagation } = contextMenu;

	if (mda !== undefined) {
		const { clientX: x, clientY: y } = e;

		setWgtState('CONTEXT1', {
			display: true,
			x,
			y,
			source: id,
			items,
			mda,
			itemHeight
		});

		ReactDOM.flushSync(() => {
			setState({ contextMenuOpened: true });
		});
	}

	e.preventDefault();

	if (stopPropagation)
		e.stopPropagation();
};

export const onContextMenuOpened = ({ setState, state: { contextMenuOpened } }) => {
	if (!contextMenuOpened)
		return;

	ReactDOM.flushSync(() => {
		setState({ contextMenuOpened: false });
	});
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
