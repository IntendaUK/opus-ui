//Imports
import { stateManager } from '../../../system/managers/stateManager';

//Helpers
import { showFlowArrow, hideFlowArrow } from './flowArrow';

//Internal
let opusHighlightOverlay = null;
let componentSelectorActive = false;
let lastHighlightedId = null;
let mouseMoveHandler = null;
let clickHandler = null;

//Helpers
const showOverlay = id => {
	if (opusHighlightOverlay)
		opusHighlightOverlay.remove();

	const el = document.getElementById(id);
	if (!el) {
		console.warn(`Element with id "${id}" not found.`);

		return;
	}

	const rect = el.getBoundingClientRect();

	opusHighlightOverlay = document.createElement('div');
	opusHighlightOverlay.style.position = 'fixed';
	opusHighlightOverlay.style.top = `${rect.top + window.scrollY}px`;
	opusHighlightOverlay.style.left = `${rect.left + window.scrollX}px`;
	opusHighlightOverlay.style.width = `${rect.width}px`;
	opusHighlightOverlay.style.height = `${rect.height}px`;
	opusHighlightOverlay.style.backgroundColor = 'rgba(130, 170, 255, 0.3)';
	opusHighlightOverlay.style.pointerEvents = 'none';
	opusHighlightOverlay.style.zIndex = '999999';

	document.body.appendChild(opusHighlightOverlay);
};

const hideOverlay = () => {
	if (opusHighlightOverlay) {
		opusHighlightOverlay.remove();
		opusHighlightOverlay = null;
	}
};

const getState = idComponent => {
	const res = {
		id: idComponent,
		state: stateManager.getWgtState(idComponent),
		timestamp: new Date().toISOString()
	};

	return res;
};

const hideComponentSelector = () => {
	if (!componentSelectorActive)
		return;

	componentSelectorActive = false;

	document.removeEventListener('mousemove', mouseMoveHandler, true);
	document.removeEventListener('click', clickHandler, true);

	mouseMoveHandler = null;
	clickHandler = null;
	lastHighlightedId = null;

	hideOverlay();
};

const showComponentSelector = () => {
	if (componentSelectorActive)
		return;

	componentSelectorActive = true;

	mouseMoveHandler = event => {
		const { clientX, clientY } = event;
		let el = document.elementFromPoint(clientX, clientY);

		if (!el) return;

		// Traverse up to find the closest component with a class starting with "cpn"
		while (el && !Array.from(el.classList).some(c => c.startsWith('cpn')))
			el = el.parentElement;

		if (!el) {
			hideOverlay();
			lastHighlightedId = null;

			return;
		}

		const id = el.id;
		if (id && id !== lastHighlightedId) {
			showOverlay(id);
			lastHighlightedId = id;
		}
	};

	clickHandler = event => {
		event.preventDefault();
		event.stopPropagation();

		if (lastHighlightedId && window._OPUS_DEVTOOLS_GLOBAL_HOOK?.onSelectComponentClick)
			window._OPUS_DEVTOOLS_GLOBAL_HOOK.onSelectComponentClick(lastHighlightedId);

		hideComponentSelector();
	};

	document.addEventListener('mousemove', mouseMoveHandler, true);
	document.addEventListener('click', clickHandler, true);
};

//Initializer
const bindDevtools = () => {
	window._OPUS_DEVTOOLS_GLOBAL_HOOK.getState = getState;
	window._OPUS_DEVTOOLS_GLOBAL_HOOK.showOverlay = showOverlay;
	window._OPUS_DEVTOOLS_GLOBAL_HOOK.hideOverlay = hideOverlay;
	window._OPUS_DEVTOOLS_GLOBAL_HOOK.showFlowArrow = showFlowArrow;
	window._OPUS_DEVTOOLS_GLOBAL_HOOK.hideFlowArrow = hideFlowArrow;
	window._OPUS_DEVTOOLS_GLOBAL_HOOK.showComponentSelector = showComponentSelector;
	window._OPUS_DEVTOOLS_GLOBAL_HOOK.hideComponentSelector = hideComponentSelector;
};

export default bindDevtools;
