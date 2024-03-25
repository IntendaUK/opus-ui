//React
import React, { useState, useEffect } from 'react';

//Events
import { getPopoverMouseEvents, getPopoverMouseEventsNative } from './helpers';

//Components
import PopoverEntry from './popoverEntry';

//This component renders a list of popoverMda elements
const PopoverList = ({ props: { id, state: { popoverMda } }, popoverRef }) => {
	if (!popoverMda)
		return null;

	const res = popoverMda.map((p, i) => {
		//We can't use just 'id-i' because components like 'input' render labels for themselves with
		// the '-0' suffix so we also add '-popover'
		const key = `${id}-popover-${p.id || i}`;
		if (!p.id)
			p.id = key;

		p.parentId = id;

		return (
			<PopoverEntry
				key={key}
				mda={p}
				popoverRef={popoverRef}
			/>
		);
	});

	return res;
};

//This component creates an invisible element to use as a ref for positioning popper elements
const RefMaker = ({ props, setPopoverRef, ownerEvents }) => {
	const { state: { canHover, tooltip, enabled } } = props;

	//Only trap mouse events when we absolutely have to
	const pointerEvents = (canHover || tooltip || ownerEvents) ? 'auto' : 'none';

	const refDivProps = {
		//The popoverRef class is used for integration tests and the noAutoMargin class is applied so
		// as to opt out of auto margin application by containers
		className: 'popoverRef noAutoMargin',
		ref: setPopoverRef,
		style: {
			width: '100%',
			height: '100%',
			position: 'absolute',
			left: 0,
			top: 0,
			pointerEvents,
			zIndex: 1
		}
	};

	if (tooltip || canHover) {
		//When tooltip or canHover are truthy, we always need to attach popover mouse events.
		// This will also handle the binding of ownerEvents, if they are present
		const mouseEvents = getPopoverMouseEvents(props, ownerEvents);
		Object.assign(refDivProps, mouseEvents);
	} else if (ownerEvents) {
		//If we don't need to show/hide tooltips or apply hoverPrps, we still need to apply
		// owner events
		Object.assign(refDivProps, ownerEvents);
	}

	//If a component is disabled (pointerEvents: none), the refDiv will still capture events and
	// bubble them up to the parent. Which is why we need this:
	if (!enabled)
		refDivProps.onClickCapture = e => e.stopPropagation();

	return <div {...refDivProps} />;
};

//This component manually attaches tooltip/hoverPrp event handlers to owner refs
const SelfRefEventBinder = ({ props, ownerRef: { current: el } }) => {
	useEffect(() => {
		const mouseEvents = getPopoverMouseEventsNative(props);

		Object.entries(mouseEvents).forEach(([eventName, handler]) => {
			el.addEventListener(eventName, handler);
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return null;
};

const PopoverInner = ({ props, ownerRef, selfControlledRef, ownerEvents }) => {
	const [popoverRef, setPopoverRef] = useState();

	//If the parent is in control of the ref, we need to wait for it to exist first, or positioning
	// will be off
	if (selfControlledRef && (!ownerRef || !ownerRef.current))
		return null;

	//usePopoverRef is what popper will use to position the popover. When the owner component
	// controls the ref, we'll set that to the ownerRef
	let usePopoverRef = popoverRef;
	//selfEventBinder is the component that will bind the relevant mouse events to the owner
	// component's ref. This is to facilitate showing/hiding tooltips and setting hoverPrps
	let selfEventBinder = null;
	//refMaker is the component that will render the invisible ref element when none is provided
	// by the owner component
	let refMaker = null;

	if (selfControlledRef) {
		usePopoverRef = ownerRef.current;
		selfEventBinder = <SelfRefEventBinder props={props} ownerRef={ownerRef} />;
	} else {
		refMaker = (
			<RefMaker
				props={props}
				setPopoverRef={setPopoverRef}
				ownerEvents={ownerEvents}
			/>
		);
	}

	return (
		<>
			{refMaker}
			{selfEventBinder}
			<PopoverList props={props} popoverRef={usePopoverRef} />
		</>
	);
};

export default PopoverInner;
