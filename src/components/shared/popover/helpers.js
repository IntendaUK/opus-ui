//Events
import { onMouseOver, onMouseLeave } from './events';

//Returns the events that manage showing and hiding tooltips on hovering on components.
// These events should be spread into the relevant parent component in cases where it
// manages its own ref.
export const getPopoverMouseEvents = ({ getHandler }, ownerEvents) => {
	const handlerOnMouseOver = getHandler(onMouseOver, ownerEvents);
	const handlerOnMouseLeave = getHandler(onMouseLeave, ownerEvents);

	const res = {
		onMouseOver: handlerOnMouseOver,
		onMouseLeave: handlerOnMouseLeave
	};

	if (ownerEvents) {
		if (ownerEvents.onClick)
			res.onClick = ownerEvents.onClick;

		if (ownerEvents.onContextMenu)
			res.onContextMenu = ownerEvents.onContextMenu;
	}

	return res;
};

//This method does the same as getPopoverMouseEvents except the events are named to
// match dom events since this is applied directly to the ref element as opposed to
// being applied through react.
export const getPopoverMouseEventsNative = ({ getHandler }, ownerEvents) => {
	const handlerOnMouseOver = getHandler(onMouseOver, ownerEvents);
	const handlerOnMouseLeave = getHandler(onMouseLeave, ownerEvents);

	const res = {
		mouseover: handlerOnMouseOver,
		mouseleave: handlerOnMouseLeave
	};

	if (ownerEvents && ownerEvents.onClick)
		res.click = ownerEvents.onClick;

	return res;
};
