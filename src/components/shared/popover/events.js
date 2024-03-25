//System Helpers
import { clone } from '../../../system/helpers';

//Eternal Helpers
import morphConfig from '../../scriptRunner/helpers/morphConfig';

//Config
const tooltipPopoverId = 'tooltip';

//Helpers
const buildTooltip = ({ id, state }, newState) => {
	const { tooltip, tooltipMda, tooltipBlueprint, tooltipPosition, tooltipZIndex } = state;

	const mda = {
		//Tooltip popovers always receive the same id (tooltipPopoverId). This id is used in the
		// deleteAction of the property specification.
		id: tooltipPopoverId,
		parentId: id,
		position: tooltipPosition,
		blueprint: tooltipBlueprint,
		blueprintPrps: { tooltip },
		popoverZIndex: tooltipZIndex
	};

	if (tooltipMda)
		Object.assign(mda, tooltipMda);

	//It's possible that hoverPrps also define popoverMda, so we need to push to the array,
	// otherwise we risk overwriting.
	newState.popoverMda.push(mda);
};

const removeTooltip = newState => {
	const newDelete = {
		key: 'popoverMda',
		//We know what the id is because we defined it
		value: { id: tooltipPopoverId }
	};

	//It's possible that hoverPrps define deleteKeys too, so we need to push to the array,
	// otherwise we risk overwriting.
	if (newState.deleteKeys)
		newState.deleteKeys.push(newDelete);
	else
		newState.deleteKeys = [newDelete];
};

//Events
export const onMouseOver = (props, ownerEvents) => {
	const { setState, state } = props;
	const { canHover, tooltip, tooltipMda, hoverPrps } = state;

	if (ownerEvents && ownerEvents.onMouseOver)
		ownerEvents.onMouseOver();

	if (!tooltip && !tooltipMda && (!canHover || !hoverPrps || !hoverPrps.on))
		return;

	const newState = {
		popoverMda: [],
		hovered: true
	};

	if (canHover && hoverPrps && hoverPrps.on)
		clone(newState, hoverPrps.on);

	if (tooltip || tooltipMda)
		buildTooltip(props, newState);

	const morphedState = morphConfig(newState, { ownerId: props.id }, props, true);

	setState(morphedState);
};

export const onMouseLeave = (props, ownerEvents) => {
	const { setState, state: { canHover, tooltip, hoverPrps, tooltipMda } } = props;

	if (ownerEvents && ownerEvents.onMouseLeave)
		ownerEvents.onMouseLeave();

	if (!tooltip && !tooltipMda && (!canHover || !hoverPrps || !hoverPrps.off))
		return;

	const newState = { hovered: false };

	if (canHover && hoverPrps && hoverPrps.off)
		clone(newState, hoverPrps.off);

	if (tooltip || tooltipMda)
		removeTooltip(newState);

	const morphedState = morphConfig(newState, { ownerId: props.id }, props, true);

	setState(morphedState);
};
