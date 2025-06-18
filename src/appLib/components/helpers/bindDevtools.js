/* eslint-disable max-lines-per-function, max-lines */

//Imports
import { clone } from '../../../system/helpers';
import { stateManager } from '../../../system/managers/stateManager';
import { getNodesArrayForDevtools } from '../../../system/managers/scopeManager';
import { getComponentTypes, getFullPropSpec } from '../../../system/managers/componentManager';
import buildTestIdLocator from './bindDevtools/buildTestIdLocator';

//Internal
let opusHighlightOverlay = null;
let existingFlowArrow = null;
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

const hideFlowArrow = () => {
	if (existingFlowArrow)
		existingFlowArrow.remove();
};

const showFlowArrow = ({ from: flowFrom, fromKey, to: flowTo, toKey }) => {
	hideFlowArrow();

	const fromElement = document.getElementById(flowFrom);
	const toElement = document.getElementById(flowTo);

	if (!fromElement || !toElement) return;

	const fromRect = fromElement.getBoundingClientRect();
	const toRect = toElement.getBoundingClientRect();

	const fromMidX = fromRect.left;
	const fromMidY = fromRect.top;
	const toMidX = toRect.left;
	const toMidY = toRect.top;

	// Create SVG element
	const svgNS = 'http://www.w3.org/2000/svg';
	const svg = document.createElementNS(svgNS, 'svg');
	svg.setAttribute('id', 'flow-arrow-svg');
	svg.style.position = 'fixed';
	svg.style.top = '0';
	svg.style.left = '0';
	svg.style.width = '100%';
	svg.style.height = '100%';
	svg.style.pointerEvents = 'none';
	svg.style.zIndex = '10000';

	existingFlowArrow = svg;

	// Create defs container (for marker and filter)
	const defs = document.createElementNS(svgNS, 'defs');

	// --- Create arrowhead marker ---
	const marker = document.createElementNS(svgNS, 'marker');
	marker.setAttribute('id', 'arrowhead');
	marker.setAttribute('markerWidth', '10');
	marker.setAttribute('markerHeight', '7');
	marker.setAttribute('refX', '10');
	marker.setAttribute('refY', '3.5');
	marker.setAttribute('orient', 'auto');

	const polygon = document.createElementNS(svgNS, 'polygon');
	polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
	polygon.setAttribute('fill', 'rgba(75, 192, 192, 0.8)');

	marker.appendChild(polygon);
	defs.appendChild(marker);

	// --- Create filter for outer text outline ---
	const filter = document.createElementNS(svgNS, 'filter');
	filter.setAttribute('id', 'text-stroke');
	// Expand the text shape (increase radius for thicker outline)
	const feMorphology = document.createElementNS(svgNS, 'feMorphology');
	feMorphology.setAttribute('operator', 'dilate');
	feMorphology.setAttribute('radius', '2');
	feMorphology.setAttribute('in', 'SourceAlpha');
	feMorphology.setAttribute('result', 'dilated');
	filter.appendChild(feMorphology);

	// Color the expanded area black
	const feFlood = document.createElementNS(svgNS, 'feFlood');
	feFlood.setAttribute('flood-color', 'black');
	feFlood.setAttribute('result', 'flood');
	filter.appendChild(feFlood);

	// Use the dilated shape as a mask for the flood color
	const feComposite = document.createElementNS(svgNS, 'feComposite');
	feComposite.setAttribute('in', 'flood');
	feComposite.setAttribute('in2', 'dilated');
	feComposite.setAttribute('operator', 'in');
	feComposite.setAttribute('result', 'outline');
	filter.appendChild(feComposite);

	// Merge the black outline with the original graphic (white text on top)
	const feMerge = document.createElementNS(svgNS, 'feMerge');
	const feMergeNode1 = document.createElementNS(svgNS, 'feMergeNode');
	feMergeNode1.setAttribute('in', 'outline');
	feMerge.appendChild(feMergeNode1);
	const feMergeNode2 = document.createElementNS(svgNS, 'feMergeNode');
	feMergeNode2.setAttribute('in', 'SourceGraphic');
	feMerge.appendChild(feMergeNode2);
	filter.appendChild(feMerge);

	defs.appendChild(filter);
	svg.appendChild(defs);

	// Create arrow line
	const line = document.createElementNS(svgNS, 'line');
	line.setAttribute('x1', fromMidX);
	line.setAttribute('y1', fromMidY);
	line.setAttribute('x2', toMidX);
	line.setAttribute('y2', toMidY);
	line.setAttribute('stroke', 'rgba(75, 192, 192, 0.8)');
	line.setAttribute('stroke-width', '2');
	line.setAttribute('marker-end', 'url(#arrowhead)');
	svg.appendChild(line);

	// Calculate angle and perpendicular offset
	const deltaX = toMidX - fromMidX;
	const deltaY = toMidY - fromMidY;
	const angleRad = Math.atan2(deltaY, deltaX);
	const angleDeg = (angleRad * 180) / Math.PI;

	// Perpendicular unit vector
	const hypotenuse = Math.hypot(deltaX, deltaY);
	const perpX = -deltaY / hypotenuse;
	const perpY = deltaX / hypotenuse;
	const offset = -8;

	// Add fromKey text at the start of the line
	if (fromKey) {
		const baseX = fromMidX + ((toMidX - fromMidX) * 0.2);
		const baseY = fromMidY + ((toMidY - fromMidY) * 0.2);
		const fromTextX = baseX + perpX * offset;
		const fromTextY = baseY + perpY * offset;

		const fromText = document.createElementNS(svgNS, 'text');
		fromText.setAttribute('x', fromTextX);
		fromText.setAttribute('y', fromTextY);
		fromText.setAttribute('text-anchor', 'middle');
		fromText.setAttribute('fill', 'rgba(255, 255, 255, 1)');
		fromText.setAttribute('font-size', '12px');
		fromText.setAttribute('transform', `rotate(${angleDeg}, ${fromTextX}, ${fromTextY})`);
		fromText.textContent = fromKey;
		// Apply the filter for an outer outline
		fromText.setAttribute('filter', 'url(#text-stroke)');
		svg.appendChild(fromText);
	}

	// Add toKey text at the end of the line
	if (toKey) {
		const baseX = fromMidX + ((toMidX - fromMidX) * 0.8);
		const baseY = fromMidY + ((toMidY - fromMidY) * 0.8);
		const toTextX = baseX + perpX * offset;
		const toTextY = baseY + perpY * offset;

		const toText = document.createElementNS(svgNS, 'text');
		toText.setAttribute('x', toTextX);
		toText.setAttribute('y', toTextY);
		toText.setAttribute('text-anchor', 'middle');
		toText.setAttribute('fill', 'rgba(255, 255, 255, 1)');
		toText.setAttribute('font-size', '12px');
		toText.setAttribute('transform', `rotate(${angleDeg}, ${toTextX}, ${toTextY})`);
		toText.textContent = toKey;
		// Apply the filter for an outer outline
		toText.setAttribute('filter', 'url(#text-stroke)');
		svg.appendChild(toText);
	}

	document.body.appendChild(svg);
};

const getState = idComponent => {
	const state = { ...stateManager.getWgtState(idComponent) };

	//Inputs store their boxRef in state, which we can't serialize
	if (state.boxRef)
		delete state.boxRef;

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

const setComponentState = ({ target, key, value }) => {
	stateManager.setWgtState(target, { [key]: value });
};

const getGlobalConfig = () => {
	const propSpecs = { baseProps: clone({}, getFullPropSpec('typeThatDoesNotExist')) };

	getComponentTypes().forEach(c => {
		propSpecs[c] = clone({}, getFullPropSpec(c));
	});

	//Remove functions since they can't be serialized
	Object.values(propSpecs).forEach(propSpec => {
		Object.values(propSpec).forEach(propSpecEntry => {
			Object.entries(propSpecEntry).forEach(([k, v]) => {
				if (typeof(v) === 'function')
					propSpecEntry[k] = 'function';
			});
		});
	});

	return { propSpecs };
};

const buildTestIdLocatorInternal = config => {
	const res = buildTestIdLocator(config);

	const ta = document.createElement('textarea');
	ta.value = res;
	ta.style.position = 'fixed';
	ta.style.top = '0';
	ta.style.left = '0';
	ta.style.width = '1px';
	ta.style.height = '1px';
	ta.style.padding = '0';
	ta.style.border = 'none';
	ta.style.outline = 'none';
	ta.style.boxShadow = 'none';
	ta.style.background = 'transparent';
	document.body.appendChild(ta);
	ta.focus();
	ta.select();
	document.execCommand('copy');
	document.body.removeChild(ta);

	// eslint-disable-next-line no-console
	console.info('🔍 Selector copied to clipboard');
};

//Initializer
const bindDevtools = () => {
	window._OPUS_DEVTOOLS_GLOBAL_HOOK.getGlobalConfig = getGlobalConfig;
	window._OPUS_DEVTOOLS_GLOBAL_HOOK.getState = getState;
	window._OPUS_DEVTOOLS_GLOBAL_HOOK.showOverlay = showOverlay;
	window._OPUS_DEVTOOLS_GLOBAL_HOOK.hideOverlay = hideOverlay;
	window._OPUS_DEVTOOLS_GLOBAL_HOOK.showFlowArrow = showFlowArrow;
	window._OPUS_DEVTOOLS_GLOBAL_HOOK.hideFlowArrow = hideFlowArrow;
	window._OPUS_DEVTOOLS_GLOBAL_HOOK.showComponentSelector = showComponentSelector;
	window._OPUS_DEVTOOLS_GLOBAL_HOOK.hideComponentSelector = hideComponentSelector;
	window._OPUS_DEVTOOLS_GLOBAL_HOOK.setComponentState = setComponentState;
	window._OPUS_DEVTOOLS_GLOBAL_HOOK.getComponentTree = getNodesArrayForDevtools;
	window._OPUS_DEVTOOLS_GLOBAL_HOOK.buildTestIdLocator = buildTestIdLocatorInternal;
};

export default bindDevtools;
