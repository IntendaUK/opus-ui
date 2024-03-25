/* eslint-disable max-lines-per-function */

//Plugins
import { forceSimulation, forceLink, forceCollide, forceCenter } from 'd3-force';

//Consts
const linkPadding = 50;

//Helpers
const doesOverlap = (x, y, w, h, nodes, excludeIndex) => {
	const res = nodes.some((n, i) => {
		if (i === excludeIndex)
			return false;

		const noOverlap = (
			x + w + linkPadding < n.x - linkPadding ||
			y + h < n.y - linkPadding ||
			x - linkPadding >= n.x + n.w + linkPadding ||
			y - linkPadding >= n.y + n.h + linkPadding
		);

		return !noOverlap;
	});

	return res;
};

const squashNodes = nodes => {
	let midX = 0;
	let midY = 0;

	nodes.forEach(n => {
		n.midX = n.x + (n.w / 2);
		n.midY = n.y + (n.h / 2);

		midX += n.midX;
		midY += n.midY;
	});

	midX /= nodes.length;
	midY /= nodes.length;

	const jump = 10;

	/* eslint-disable-next-line no-constant-condition */
	while (true) {
		let spreadBefore = 0;
		nodes.forEach(n => {
			spreadBefore += Math.abs(n.x - midX) + Math.abs(n.y - midY);
		});

		nodes.forEach((n, i) => {
			const angleToMid = Math.atan2(n.midY - midY, n.midX - midX);
			const distanceFromMid = Math.sqrt(Math.pow(n.midY - midY, 2) + Math.pow(n.midX - midX, 2));

			const nx = n.x - (Math.cos(angleToMid) * Math.min(distanceFromMid, jump));
			const ny = n.y - (Math.sin(angleToMid) * Math.min(distanceFromMid, jump));

			if (doesOverlap(nx, ny, n.w, n.h, nodes, i))
				return;

			n.x = nx;
			n.y = ny;

			n.midX = n.x + (n.w / 2);
			n.midY = n.y + (n.h / 2);
		});

		let spreadAfter = 0;
		nodes.forEach(n => {
			spreadAfter += Math.abs(n.x - midX) + Math.abs(n.y - midY);
		});

		if (spreadAfter === spreadBefore)
			break;
	}
};

//Action
const forceDirectGraph = async config => {
	const {
		nodes,
		links,
		center,
		collideStrength,
		stopWhenDeltaUnder,
		snapToAxis,
		resetPositionsToZero = false,
		axisPadding = {
			x: 0,
			y: 0
		},
		squash = true
	} = config;

	if (resetPositionsToZero) {
		nodes.forEach(n => {
			n.x = 0;
			n.y = 0;
		});
	}

	const simulation = forceSimulation(nodes)
		.force('link', forceLink(links)
			.id(d => d.id).distance(1));

	if (collideStrength) {
		simulation.force('collide', forceCollide().strength(collideStrength)
			.radius(d => Math.sqrt(Math.pow(d.w, 2) + Math.pow(d.h, 2)) * 2));
	}

	if (center)
		simulation.force('center', forceCenter(center.x, center.y));

	await (new Promise(res => {
		simulation.on('tick', () => {
			if (simulation.alpha() < stopWhenDeltaUnder) {
				simulation.stop();

				res();
			}
		});
	}));

	if (squash)
		squashNodes(nodes);

	const minX = Math.min(...nodes.map(r => r.x));
	const minY = Math.min(...nodes.map(r => r.y));

	if (snapToAxis) {
		nodes.forEach(e => {
			if (minX !== axisPadding.x)
				e.x += -minX + axisPadding.x;

			if (minY !== axisPadding.y)
				e.y += -minY + axisPadding.y;
		});
	}

	nodes.forEach(n => {
		n.x = ~~n.x;
		n.y = ~~n.y;
	});

	return nodes;
};

export default forceDirectGraph;
