/* eslint-disable no-console, max-len, no-underscore-dangle, max-lines-per-function */

//Internals
let lastId = 0;
const traces = {};

//Config
const colors = {
	yellow: '#ca0',
	cyan: '#3bd',
	limeGreen: '#8ebf42',
	darkGrey: '#777',
	white: '#ccc'
};

//Helpers
const buildColorString = (stringsArray, colorsArray) => {
	const result = [
		stringsArray
			.map(s => `%c${s}`)
			.join(' '),
		...colorsArray.map(c => `color: ${colors[c]}; `)
	];

	return result;
};

//Methods
const trackStateChange = (entry, { currentState, newState, sourceId, sourceType }) => {
	const stateChange = {
		currentState: JSON.parse(JSON.stringify(currentState)),
		newState: JSON.parse(JSON.stringify(newState)),
		sourceId,
		sourceType
	};
	entry.stateChanges.push(stateChange);

	console.groupCollapsed(...buildColorString([
		'[DIAGNOSTICS LOG]',
		entry.track,
		'/',
		stateChange.sourceType,
		'/',
		entry.stateChanges.length
	], [
		'limeGreen',
		'white',
		'darkGrey',
		'white',
		'darkGrey',
		'darkGrey'
	]));

	console.log(...buildColorString([
		'[SOURCE TYPE]',
		sourceType
	], [
		'white',
		'darkGrey'
	]));

	console.log(...buildColorString([
		'[SOURCE ID]',
		sourceId === entry.componentId ? '{self}' : sourceId
	], [
		'white',
		'darkGrey'
	]));

	console.groupCollapsed(...buildColorString([
		'[SOURCE ELEMENT]'
	], [
		'cyan'
	]));
	console.log(document.getElementById(sourceId));
	console.groupEnd();

	console.groupCollapsed(...buildColorString([
		'[STATE BEFORE]'
	], [
		'cyan'
	]));
	console.log(stateChange.currentState);
	console.groupEnd();

	console.groupCollapsed(...buildColorString([
		'[STATE CHANGES]'
	], [
		'yellow'
	]));
	console.log(stateChange.newState);
	console.groupEnd();

	console.groupEnd();
};

export const register = ({ id, diagnostics: { track } }) => {
	let entry = traces[id];
	if (!entry) {
		entry = {
			id: ++lastId,
			track,
			componentId: id,
			stateChanges: []
		};

		traces[id] = entry;
	}

	const _trackStateChange = trackStateChange.bind(null, entry);

	return { trackStateChange: _trackStateChange };
};
