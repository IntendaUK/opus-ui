//Plugins
import ndarray from 'ndarray';
import createPlanner from 'l1-path-finder';

//Internal
const planners = {};
const spaces = {};
const plannerSizes = {};

//Action
const buildPathFindingMap = config => {
	const { rects, w, h, storeAsName, padding = 10, zoom = 10 } = config;

	const space = Array(~~(h / zoom) * ~~(w / zoom)).fill(0);

	rects.forEach(({ x: rx, y: ry, h: rh, w: rw }) => {
		for (let i = Math.floor((ry - padding) / zoom); i < Math.ceil((ry + rh + padding) / zoom); i++) {
			const indexY = i * ~~(w / zoom);
			for (let j = Math.floor((rx - padding) / zoom); j < Math.ceil((rx + rw + padding) / zoom); j++) {
				const index = indexY + j;

				space[index] = 1;
			}
		}
	});

	const planner = createPlanner(ndarray(space, [~~(h / zoom), ~~(w / zoom)]));
	planners[storeAsName] = planner;
	spaces[storeAsName] = space;
	plannerSizes[storeAsName] = {
		w,
		h
	};
};

export const getPlanner = name => {
	return planners[name];
};

export const doesCollide = (name, x, y, zoom = 1) => {
	const space = spaces[name];
	const plannerSize = plannerSizes[name];

	const indexY = y * ~~(plannerSize.w / zoom);
	const index = indexY + x;

	return space[index] === 1;
};

export default buildPathFindingMap;
