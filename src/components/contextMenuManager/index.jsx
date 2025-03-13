//React
import React, { useContext, useEffect, useCallback, useMemo } from 'react';

//System
import { createContext } from '../../system/managers/appManager';

//System Helpers
import { clone } from '../../system/helpers';

//Styles
import './styles.css';

//context
const ContextMenuManagerContext = createContext('contextMenuManager');

//Helpers
const getGridMda = (
	{ id, state: { items, source, prpsContainer, prpsGrid, wgtsGrid } }, prpsPosition
) => {
	const idContextGrid = `${id}-${source}-grid`;

	const mda = {
		id: `${id}-${source}-container`,
		type: 'container',
		prps: clone({}, prpsContainer, prpsPosition),
		wgts: [{
			id: idContextGrid,
			type: 'grid',
			prps: clone({}, prpsGrid, {
				staticData: items,
				scps: [	{
					triggers: [{
						event: 'onStateChange',
						source: idContextGrid,
						key: 'selectedRow'
					}],
					actions: [{
						type: 'setState',
						target: id,
						key: 'display',
						value: false
					}]
				}]
			}),
			wgts: clone([], wgtsGrid)
		}]
	};

	return mda;
};

//Events
const onClickDocument = ({ id, setState, state: { display } }, e) => {
	if (!display)
		return;

	//Ensure the element we clicked on isn't inside a context menu
	const elContext = document.getElementById(id).childNodes[0];
	let elClick = e.target;
	let isInContext = false;
	while (!!elClick && !isInContext) {
		if (elClick.id === elContext.id)
			isInContext = true;

		elClick = elClick.parentNode;
	}

	if (!isInContext)
		setState({ display: false });
};

const onToggle = ({ getHandler, setState, state: { display, items, mda, clickHandler } }) => {
	if (display) {
		const handler = getHandler(onClickDocument);
		document.addEventListener('mousedown', handler);

		setState({ clickHandler: handler });

		return;
	}

	if (!display || !(items && mda))
		return;

	document.removeEventListener('mousedown', clickHandler);

	setState({ deleteKeys: ['items', 'mda', 'id', 'clickHandler'] });
};

//Components
const InnerMda = ({ prpsPosition }) => {
	const { ChildWgt, state: { mda } } = useContext(ContextMenuManagerContext);

	Object.assign(mda.prps, prpsPosition);

	return (
		<ChildWgt mda={mda} />
	);
};

const InnerItems = ({ prpsPosition }) => {
	const { ChildWgt, getHandler, state } = useContext(ContextMenuManagerContext);
	const { items, source, x, y } = state;

	const deltaGetGridMda = `${x}-${y}-${source}-${JSON.stringify(items)}`;
	const cbGetGridMda = useCallback(getHandler(getGridMda, prpsPosition), [deltaGetGridMda]);
	const mda = useMemo(cbGetGridMda, [deltaGetGridMda]);

	return (
		<ChildWgt mda={mda} />
	);
};

const Body = () => {
	const { state: { mda, x, y, itemHeight } } = useContext(ContextMenuManagerContext);
	const screenHeight = window.innerHeight;

	let menuHeight = 0;
	if (mda)
		menuHeight = mda.wgts.length * itemHeight;

	let top = y;
	if (y + menuHeight > screenHeight)
		top = screenHeight - menuHeight - 24;

	const prpsPosition = {
		position: 'absolute',
		left: x,
		top
	};

	const Inner = mda ? InnerMda : InnerItems;

	return (
		<Inner prpsPosition={prpsPosition} />
	);
};

export const ContextMenuManager = props => {
	const { id, getHandler, classNames, attributes, state: { display } } = props;

	useEffect(getHandler(onToggle), [display]);

	if (!display)
		return null;

	return (
		<ContextMenuManagerContext.Provider value={props}>
			<div
				id={id}
				className={classNames}
				{...attributes}>
				<Body />
			</div>
		</ContextMenuManagerContext.Provider>
	);
};
