/* eslint-disable no-console, max-len, no-underscore-dangle, max-lines */

//System Helpers
import spliceWhere from '@spliceWhere';

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
const trackAction = (run, { scope, config, morphedConfig, result, success, actionTrackers }) => {
	//If the previous action has a morphedConfig.type of 'consume' we consume it and use its actions array
	let useActions = [];
	const actions = run.actionsArrayStack[run.actionsArrayStack.length - 1];
	let lastAction = actions[actions.length - 1];
	while (lastAction?.morphedConfig.type === 'consume' && morphedConfig.type !== 'consume') {
		useActions.push(...lastAction.actions);

		spliceWhere(actions, a => a === lastAction);

		lastAction = actions[actions.length - 1];
	}

	const actionEntry = {
		actionType: morphedConfig.type,
		scope,
		success,
		config: JSON.parse(JSON.stringify(config ?? '{{undefined}}')),
		morphedConfig: JSON.parse(JSON.stringify(morphedConfig ?? '{{undefined}}')),
		actionTrackers: JSON.parse(JSON.stringify(actionTrackers ?? '{{undefined}}')),
		result: JSON.parse(JSON.stringify(result ?? '{{undefined}}')),
		actions: useActions
	};

	run.actionsArrayStack[run.actionsArrayStack.length - 1].push(actionEntry);

	if (morphedConfig.diagnostics?.pinAction)
		run.pinned.actions.push(actionEntry);

	if (morphedConfig.diagnostics?.pinKeys) {
		morphedConfig.diagnostics.pinKeys.forEach(k => {
			const { name = k, key = k } = k;

			run.pinned.keys.push({
				name,
				value: JSON.parse(JSON.stringify(morphedConfig[key] ?? '{{undefined}}'))
			});
		});
	}
};

const trackSubActions = run => {
	const currentActionsArray = run.actionsArrayStack[run.actionsArrayStack.length - 1];
	const lastAction = currentActionsArray[currentActionsArray.length - 1];

	run.actionsArrayStack.push(lastAction.actions);
};

const stopTrackingSubActions = run => {
	run.actionsArrayStack.pop();
};

/* eslint-disable max-lines-per-function */
const renderActions = actions => {
	console.groupCollapsed('[ACTIONS]');
	actions.forEach(({ actionType, scope, config, morphedConfig, result, actionTrackers, actions: subActions }) => {
		console.groupCollapsed(...buildColorString([
			`[${actionType}]`
		], [
			'yellow'
		]));
		console.groupCollapsed('[CONFIG]');
		console.table([{
			actionType,
			scope,
			config,
			morphedConfig,
			result
		}]);
		console.groupEnd();

		if (actionTrackers.accessors.length > 0) {
			console.groupCollapsed(...buildColorString([
				'[ACCESSORS]'
			], [
				'cyan'
			]));
			console.table(actionTrackers.accessors);
			console.groupEnd();
		}

		if (actionTrackers.evalParameters.length > 0) {
			console.groupCollapsed(...buildColorString([
				'[EVAL PARAMETERS]'
			], [
				'cyan'
			]));
			console.table(actionTrackers.evalParameters);
			console.groupEnd();
		}

		if (actionTrackers.fnArgs.length > 0) {
			console.groupCollapsed(...buildColorString([
				'[FUNCTION ARGUMENTS]'
			], [
				'cyan'
			]));
			console.table(actionTrackers.fnArgs);
			console.groupEnd();
		}

		if (actionTrackers.scopedIdLookups.length > 0) {
			console.groupCollapsed(...buildColorString([
				'[SCOPED ID LOOKUPS]'
			], [
				'cyan'
			]));
			console.table(actionTrackers.scopedIdLookups);
			console.groupEnd();
		}

		if (subActions?.length > 0)
			renderActions(subActions);

		console.groupEnd();
	});
	console.groupEnd();

	console.groupCollapsed('[RESULTS TABLE]');
	console.table(actions.map(({ actionType, success, result }) => {
		return {
			actionType,
			success,
			result: JSON.parse(JSON.stringify(result))
		};
	}));
	console.groupEnd();
};

/* eslint-disable max-lines-per-function */
const logDiagnostics = (entry, run) => {
	run.timeEnd = new Date();
	run.timeDuration = (+run.timeEnd - run.timeStart);

	console.groupCollapsed(...buildColorString([
		'[DIAGNOSTICS LOG]',
		entry.track,
		'/',
		run.subTrack,
		'/',
		run.id
	], [
		'limeGreen',
		'white',
		'darkGrey',
		'white',
		'darkGrey',
		'darkGrey'
	]));

	if (run.pinned.actions.length > 0) {
		console.groupCollapsed('[PINNED]');
		renderActions(run.pinned.actions);

		console.groupCollapsed('[KEYS]');
		console.table(run.pinned.keys);
		console.groupEnd();

		console.groupEnd();
	}

	console.groupCollapsed('[STATS]');
	console.info(`Run duration: ${run.timeDuration}ms`);
	console.info({ allRuns: entry.runs });
	console.groupEnd();

	renderActions(run.actions);

	console.groupEnd();
};

export const register = ({ script }) => {
	const { diagnostics: { track, subTrack } } = script;

	let entry = traces[track];
	if (!entry) {
		entry = {
			track,
			runs: []
		};

		traces[track] = entry;
	}

	const run = {
		id: ++lastId,
		subTrack,
		timeStart: new Date(),
		timeEnd: null,
		actions: [],
		actionsArrayStack: [],
		pinned: {
			actions: [],
			keys: []
		}
	};
	run.actionsArrayStack.push(run.actions);

	entry.runs.push(run);

	const _trackAction = trackAction.bind(null, run);
	const _trackSubActions = trackSubActions.bind(null, run);
	const _stopTrackingSubActions = stopTrackingSubActions.bind(null, run);
	const _logDiagnostics = logDiagnostics.bind(null, entry, run);

	return {
		trackAction: _trackAction,
		trackSubActions: _trackSubActions,
		stopTrackingSubActions: _stopTrackingSubActions,
		logDiagnostics: _logDiagnostics
	};
};
