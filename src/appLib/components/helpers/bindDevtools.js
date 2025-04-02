/* eslint-disable max-lines-per-function */

//Imports
import { stateManager } from '../../../system/managers/stateManager';

//Internal
let opusHighlightOverlay = null;
let existingFlowArrow = null;

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

	if (!fromElement || !toElement)
		return;

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

	// Create arrow line
	const line = document.createElementNS(svgNS, 'line');
	line.setAttribute('x1', fromMidX);
	line.setAttribute('y1', fromMidY);
	line.setAttribute('x2', toMidX);
	line.setAttribute('y2', toMidY);
	line.setAttribute('stroke', 'rgba(75, 192, 192, 0.8)');
	line.setAttribute('stroke-width', '2');
	line.setAttribute('marker-end', 'url(#arrowhead)');

	// Create arrowhead marker
	const defs = document.createElementNS(svgNS, 'defs');
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
	svg.appendChild(defs);
	svg.appendChild(line);

	// Calculate angle and perpendicular offset
	const deltaX = toMidX - fromMidX;
	const deltaY = toMidY - fromMidY;
	const angleRad = Math.atan2(deltaY, deltaX);
	const angleDeg = (angleRad * 180) / Math.PI;

	// Perpendicular unit vector
	const perpX = -deltaY / Math.hypot(deltaX, deltaY);
	const perpY = deltaX / Math.hypot(deltaX, deltaY);
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
		svg.appendChild(toText);
	}

	document.body.appendChild(svg);
};

const getState = idComponent => {
	const res = {
		id: idComponent,
		state: stateManager.getWgtState(idComponent),
		timestamp: new Date().toISOString()
	};

	return res;
};

//Initializer
const bindDevtools = () => {
	window._OPUS_DEVTOOLS_GLOBAL_HOOK.getState = getState;
	window._OPUS_DEVTOOLS_GLOBAL_HOOK.showOverlay = showOverlay;
	window._OPUS_DEVTOOLS_GLOBAL_HOOK.hideOverlay = hideOverlay;
	window._OPUS_DEVTOOLS_GLOBAL_HOOK.showFlowArrow = showFlowArrow;
	window._OPUS_DEVTOOLS_GLOBAL_HOOK.hideFlowArrow = hideFlowArrow;
};

export default bindDevtools;
