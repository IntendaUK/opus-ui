//React
import { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';

//System
import { getComponent, getFullPropSpec } from '../managers/componentManager';
import { stateManager } from '../managers/stateManager';
import { addNodeToDom, removeNodeFromDom } from '../managers/scopeManager';
import { buildMappedProps } from './helpers';
import buildState from './helpers/buildState';
import { buildProps } from './helpers';

//Events
const onUnmount = mda => {
	const { id } = mda;

	stateManager.cleanupState(id);

	removeNodeFromDom(mda);
};

window.za = 0;
window.zb = 0;
window.zc = 0;
window.zd = 0;
window.ze = 0;

export const onMount = (mda, ctx, setWrapperState, cpnState, setComponentState) => {
	const { id, type, wgts } = mda;

	stateManager.initState(id, setComponentState, cpnState);

	const addedNode = addNodeToDom(mda);
	if (!addedNode) {
		console.error('DUPLICATE ID FOUND FOR METADATA: ', mda);

		return;
	}

	const setState = stateManager.setSelfState.bind(null, id);

	const propSpec = getFullPropSpec(type);

	const mappedProps = buildMappedProps(ctx, propSpec, mda);

	const state = buildState(mappedProps, mda, propSpec, false);
	Object.assign(cpnState, state);
	const componentProps = buildProps(wgts, setState, ctx, id);

	stateManager.setComponentType(id, type);

	setWrapperState(componentProps);
	setComponentState(cpnState);

	return onUnmount.bind(null, mda);
};

/* eslint-disable-next-line max-lines-per-function */
const WrapperStatic = ({ mda, ctx, timeStart }) => {
	const [componentProps, setWrapperState] = useState();
	const [cpnState, setCpnState] = useState({});

	const { id, type, container, wgts } = mda;

	const Component = useMemo(() => getComponent(type), [type]);

	const cbMount = onMount.bind(null, mda, ctx, setWrapperState, cpnState, setCpnState);
	useEffect(cbMount, []);

	if (!Component || !componentProps || !cpnState.type)
		return null;

	if (timeStart) {
		window.tt += performance.now() - timeStart;
		window.tc++;

		console.log(window.tc, window.tt);
	}

	componentProps.state = cpnState;
	componentProps.wgts = wgts;

	const result = (
		<Component
			key={id}
			{...componentProps}
			{...cpnState.genStyles}
			classNames={cpnState.genClassNames}
			attributes={cpnState.genAttributes}
		/>
	);

	return result;
};

export default WrapperStatic;
