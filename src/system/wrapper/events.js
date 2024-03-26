//System
import { register, destroyScope, emitEvent, queueChanges } from '../managers/flowManager/index';
import { addNodeToDom, removeNodeFromDom } from '../managers/scopeManager';
import { stateManager } from '../managers/stateManager';
import { removePersistedStatesForScope, persistState } from '../managers/propertyManager';
import opusConfig from '../../config';

//Helpers
import { getComponent, buildMappedProps } from './helpers';
import { buildProps } from './helpers';
import buildState from './helpers/buildState';

//External Helpers
import { clone } from '../helpers';
import { buildStyleTag, removeStyleTag } from './helpers/styleTags.js';
import { disposeScripts } from '../../components/scriptRunner/interface';
import { disposeLateBoundTriggers } from '../../components/scriptRunner/helpers/lateBoundTriggers';
import { register as registerDiagnostics } from '../../components/scriptRunner/diagnostics/states';

//Events
const onUnmount = mda => {
	const { id } = mda;

	emitEvent(id, 'onUnmount', { full: { id } });

	const state = stateManager.getWgtState(id);
	if (state.persist) {
		state.persist.forEach(p => {
			persistState(id, p, undefined, state[p], 'session');
		});
	}

	stateManager.cleanupState(id);
	disposeLateBoundTriggers(id);
	disposeScripts(id);
	destroyScope(id);
	removeStyleTag(id);
	removePersistedStatesForScope(id);

	removeNodeFromDom(mda);
};

export const onGetComponent = (mda, context, setComponent) => {
	getComponent(mda, context, setComponent);
};

export const onMount = (mda, ctx, setWrapperState, propSpec, cpnState, setComponentState) => {
	const { id, type, wgts } = mda;

	ctx.initState(id, setComponentState, cpnState);

	const addedNode = addNodeToDom(mda);
	if (!addedNode) {
		console.error('DUPLICATE ID FOUND FOR METADATA: ', mda);

		return;
	}

	const setState = ctx.setSelfState.bind(null, id);

	const mappedProps = buildMappedProps(ctx, propSpec, mda);

	const state = buildState(mappedProps, mda, propSpec, false);
	Object.assign(cpnState, state);
	const componentProps = buildProps(wgts, setState, ctx, id);

	if (cpnState.diagnostics?.trackStateChanges && opusConfig.env === 'development') {
		const { trackStateChange } = registerDiagnostics(cpnState);
		componentProps.trackStateChange = trackStateChange;
	}

	ctx.setComponentType(id, type);

	queueChanges(id, cpnState, [], cpnState);
	register(mappedProps.flows, id, mappedProps);

	setWrapperState(componentProps);
	setComponentState(cpnState);

	return onUnmount.bind(null, mda);
};

export const onStyleChanged = (id, state) => {
	const { style, styleOverrides } = state;

	if (!style && !styleOverrides)
		return;

	const mergedStyles = {};
	if (style)
		clone(mergedStyles, style);
	if (styleOverrides)
		clone(mergedStyles, styleOverrides);

	const prefix = isNaN(id[0]) ? `#${id}` : `[id^='${id}']`;
	buildStyleTag(id, prefix, mergedStyles);
};

/* eslint-disable max-lines-per-function */
export const onNewProps = (context, setState, oldState, mda, propSpec) => {
	const auth = mda.auth;
	if (!auth)
		return;

	const mappedProps = buildMappedProps(context, propSpec, mda);
	//The last argument instructs buildState not to check flows as this event
	// strictly deals with new metadata being passed into wrapper.
	const state = buildState(mappedProps, mda, context.getWgtState, true);

	const allAuth = auth[0] === '*';

	const delta = {};
	Object.entries(state).forEach(([key, newValue]) => {
		const oldValue = oldState[key];

		if (!allAuth) {
			const ignore = (
				(
					!auth.includes(key) ||
					newValue === undefined ||
					oldValue === newValue
				) ||
				(
					(
						typeof(oldValue) === 'object' ||
						typeof(newValue) === 'object'
					) &&
					JSON.stringify(oldValue) === JSON.stringify(newValue)
				)
			);

			if (ignore)
				return;
		}

		if (setState)
			delta[key] = newValue;
		else
			oldState[key] = newValue;
	});

	if (setState && Object.keys(delta).length)
		setState(delta);
};
