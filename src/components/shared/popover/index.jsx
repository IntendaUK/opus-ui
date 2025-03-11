/*
Deciding which Popover component to use:

Popover: 			You want a ref element to be created for you that manages hiding/showing
					tooltips and rendering popoverMda. When using this variant, mouse events
					to the owner component will be blocked when the tooltip property is defined
					and/or the canHover property is set to true.

PopoverOwnRef: 		The owner component already maintains its own ref component (like input)
					And you want tooltip events to be tied in automatically and popoverMda to
					render automatically. When using this variant, any specific events that you
					want to listen to on your elements, you need to hook in manually in your
					component.

PopoverOwnEvents: 	The owner component doesn't create a ref but you want to listen to specific
					events on the ref element that's created. An example of this is the container
					component. It listens to 'click' events in order to run 'fireScript' actions.
					The reason this variant exists is because events never make it to the owner
					component's elements since the ref element can trap mouse events. When using
					this variant, it's best practice to also attach these same event listeners
					to the parent component since the invisible ref element will not be created
					if it's not needed as that would just slow down the platform.
*/

//React
import React from 'react';

//Components
import PopoverInner from './popoverInner';

//Helpers

//We opt out of rendering the PopoverInner in certain cases since creating more elements and more
// useRef calls will just slow down the platform. This is true for all three variants of Popover.
const shouldRender = ({ state: { tooltip, canHover, popoverMda = [], vis } }) => {
	const res = vis && (tooltip || canHover || popoverMda.length);

	return res;
};

//Components

export const Popover = ({ props }) => {
	if (!shouldRender(props))
		return null;

	return <PopoverInner props={props} />;
};

export const PopoverOwnRef = ({ props, ownerRef }) => {
	if (!shouldRender(props))
		return null;

	return (
		<PopoverInner
			props={props}
			ownerRef={ownerRef}
			selfControlledRef={true}
		/>
	);
};

export const PopoverOwnEvents = ({ props, ownerEvents }) => {
	if (!shouldRender(props))
		return null;

	return (
		<PopoverInner
			props={props}
			ownerEvents={ownerEvents}
		/>
	);
};
