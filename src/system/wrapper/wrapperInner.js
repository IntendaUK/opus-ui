//React
import { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';

//System
import { getInitialState, emitEvent, processQueue } from '../managers/flowManager/index';
import { getComponent, getFullPropSpec } from '../managers/componentManager';

//Events
import { onMount, onNewProps, onStyleChanged } from './events';
import { registerScripts } from './helpers';

//Helpers
/*import generateClassNames from './helpers/generateClassNames';
import generateAttributes from './helpers/generateAttributes';
import generateStyles from './helpers/generateStyles';*/

//External helpers
import { lateBindTriggers } from '../../components/scriptRunner/helpers/lateBoundTriggers';
import { fixScopeIds } from '../../components/scriptRunner/helpers/morphConfig';

//Components

//This component is in charge of firing the flowManager mount event for WrapperInner.
// We render it as a component so as to ensure that the initial wrapper setup is completed.
/*const FlowChecker = ({ id, propSpec, setState, state }) => {
	const [hasRun, setHasRun] = useState(false);

	useEffect(() => {
		if (hasRun)
			return;

		setHasRun(true);

		(async () => {
			await registerScripts(state);
			lateBindTriggers(id);
			emitEvent(id, 'onMount', { full: state });
		})();

		const flowState = getInitialState(id, {}, propSpec);
		if (Object.keys(flowState).length)
			setState(flowState);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.updates]);

	return null;
};*/

const onRunFlowChecker = (id, propSpec, setState, state) => {
	if (!setState)
		return;

	(async () => {
		await registerScripts(state);
		lateBindTriggers(id);
		emitEvent(id, 'onMount', { full: state });
	})();

	const flowState = getInitialState(id, {}, propSpec);
	if (Object.keys(flowState).length)
		setState(flowState);
};


/* eslint-disable-next-line max-lines-per-function */
const WrapperInner = ({ mda, children, ctx, mdaString }) => {
	const [componentProps, setWrapperState] = useState();
	const [cpnState, setCpnState] = useState({ updates: 0 });

	const { id, type, container, wgts } = mda;
	const { style, styleOverrides, updates } = cpnState;

	const propSpec = useMemo(() => getFullPropSpec(type), [type]);
	const Component = useMemo(() => getComponent(type), [type]);

	//Mount hook in charge of doing all the initial setup
	const cbMount = onMount.bind(null, mda, ctx, setWrapperState, propSpec, cpnState, setCpnState);
	useEffect(cbMount, []);

	//Hook that builds style and override style tags
	useEffect(onStyleChanged.bind(null, id, cpnState), [style, styleOverrides]);

	//Hook that sends off flowManager emits for changes queued up by internal setWgtState
	const cbCpnStateChanged = processQueue.bind(null, id);
	useEffect(cbCpnStateChanged, [updates]);

	//Hook that checks if any auth properties changed and updates them accordingly
	const cbNewProps = onNewProps.bind(null, ctx, componentProps?.setState, cpnState, mda, propSpec);
	useEffect(cbNewProps, [mdaString]);

	useEffect(onRunFlowChecker.bind(null, id, propSpec, componentProps?.setState, cpnState), [componentProps?.setState]);

	if (!Component || !componentProps || !cpnState.type)
		return null;

	componentProps.state = cpnState;
	componentProps.wgts = wgts;

	const result = (
		<>
			<Component
				key={id}
				{...componentProps}
				{...cpnState.genStyles}
				classNames={cpnState.genClassNames}
				attributes={cpnState.genAttributes}
				children={children}
			/>
		</>
	);

	if (container) {
		let useId = container;
		if (useId.includes('||'))
			useId = fixScopeIds(useId, { ownerId: mda.parentId });

		const elContainer = document.getElementById(useId);

		return ReactDOM.createPortal(result, elContainer);
	}

	return result;
};

export default WrapperInner;
