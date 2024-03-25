//Helpers
import { getPlanner } from './buildPathFindingMap';

//Action
const getPath = config => {
	const { mapName, from: { x: xa, y: ya }, to: { x: xb, y: yb } } = config;

	const planner = getPlanner(mapName);

	const path = [];

	planner.search(ya, xa, yb, xb, path);

	return path;
};

export default getPath;
