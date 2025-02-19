//React
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

//System
import { Wrapper } from '../../../system/wrapper/wrapper';

//Plugins
import { useFloating } from '@floating-ui/react';

//Events

//This event waits for the popover entry to be properly mounted, after which it attaches a listener
// to the element that reacts whenever the element changes size. The reason we need to do this is
// because popper doesn't know when wrapper has finished rendering. In simple situations, popper
// would be rendered as static HTML elements but we render dynamic JSON through wrapper and as a
// result, this unfortunate hack is needed. In the future, we might be able to bubble up 'onMount'
// events and deduce when a component is done rendering (because all its children are rendered).
const onFixPopperPosition = (container, id, update) => {
	if (!update)
		return;

	(async () => {
		//We can't use #id because id's could start with numbers, which makes the selector invalid.
		const el = container.querySelector(`[id='${id}']`);
		if (!el) {
			requestAnimationFrame(onFixPopperPosition.bind(null, container, id, update));

			return;
		}

		(new ResizeObserver(update)).observe(el);
	})();
};

//Components

//This is the last component in the 'chain'. It finally renders the actual popoverMda and
// uses the popoverRef for positioning purposes (through the popper library)
const PopoverEntry = ({ mda, popoverRef }) => {
	const { position, popoverContainer = 'POPOVERS', popoverZIndex = 1 } = mda;

	const renderInEl = document.getElementById(popoverContainer);

	const { refs, floatingStyles, update } = useFloating({
		elements: {
			reference: popoverRef,
		},
		placement: position
	});

	useEffect(onFixPopperPosition.bind(null, renderInEl, mda.id, update), [update]);

	const style = {
		...floatingStyles,
		zIndex: popoverZIndex
	};

	const el = (
		<div
			ref={refs.setFloating}
			style={style}
		>
			<Wrapper mda={mda} />
		</div>
	);

	const res = ReactDOM.createPortal(el, renderInEl);

	return res;
};

export default PopoverEntry;
