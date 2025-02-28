//React
import React, { useState, useEffect } from 'react';

//Opus System
import { stateManager } from './system/managers/stateManager';
import { getFullPropSpec } from './system/managers/componentManager';
import { addNodeToDom, getScopedId } from './system/managers/scopeManager';
import { registerScripts } from './system/wrapper/helpers';
import { register, emitEvent, getInitialState, processQueue } from './system/managers/flowManager/index';
import queueChanges from './system/managers/flowManager/methods/queueChanges';
import { lateBindTriggers } from './components/scriptRunner/helpers/lateBoundTriggers';
import { Wrapper } from './system/wrapper/wrapper';

//Opus Helpers
import { generateGuid } from './system/helpers';
import { getVariable } from './components/scriptRunner/actions/variableActions';
import getNextScriptId from './components/scriptRunner/helpers/getNextScriptId';

export const wrapScriptHandlerInActions = ({ script, ownerId, handler }) => {
	const res = [{
		handler: () => {
			const getVariableHelper = variableName => {
				const res = getVariable({
					scope: script.id,
					name: variableName
				}, script, { state: stateManager.getWgtState('SCRIPTRUNNER') });

				return res;
			};

			const triggeredFrom = getVariableHelper('triggeredFrom');

			handler({
				getVariable: getVariableHelper,
				triggeredFrom,
				setState: stateManager.setSelfState.bind(null, ownerId),
				setExtState: (idTarget, newState) => {
					if (idTarget.includes('||'))
						idTarget = getScopedId(idTarget, ownerId);

					stateManager.setWgtState(idTarget, newState, ownerId)
				}
			});
		}
	}];

	return res;
};

//Events
const onMount = (props, cpnState, setCpnState) => {
	let needSetId = false;

	if (!cpnState.id) {
		needSetId = true;

		cpnState.id = generateGuid();
	}

	const { id } = cpnState;

	stateManager.initState(id, setCpnState, cpnState);

	addNodeToDom(cpnState);

	queueChanges(id, cpnState, [], cpnState);
	register(props.flows, id, props);

	if (needSetId)
		stateManager.setSelfState(id, { id, mounted: true });
	else
		stateManager.setSelfState(id, { mounted: true });
};

const onRunFlowChecker = (id, cpnState, setCpnState, mounted) => {
	if (!mounted)
		return;

	(async () => {
		const { scripts } = cpnState;

		if (scripts) {
			scripts.forEach(s => {
				const { handler } = s;

				if (!handler)
					return;

				if (!s.id)
					s.id = getNextScriptId();

				s.actions = wrapScriptHandlerInActions({
					script: s,
					ownerId: id,
					handler
				});

				delete s.handler;
			});

			await registerScripts({
				id,
				scps: cpnState.scripts
			});
		}

		lateBindTriggers(id);
		emitEvent(id, 'onMount', { full: cpnState });
	})();

	const flowState = getInitialState(id, {}, getFullPropSpec());
	if (Object.keys(flowState).length)
		setCpnState(flowState);
};

//Componnets
const OC = ComponentToRender => {
	return (_props, a, b, c) => {
		const { children: _children, ...props } = _props;

		const [cpnState, setCpnState] = useState({
			id: props.id,
			scope: props.scope,
			relId: props.relId,
			flows: props.flows,
			scripts: props.scripts ?? props.scps,
			parentId: props.parentId,
			...(props.state ?? props.prps ?? {}),
			type: '_opusExternal',
			updates: 0
		});

		const { id, mounted, updates } = cpnState;

		useEffect(onMount.bind(null, props, cpnState, setCpnState), []);
		useEffect(onRunFlowChecker.bind(null, props, cpnState, setCpnState, mounted), [mounted]);
		useEffect(processQueue.bind(null, id), [updates]);

		if (!mounted)
			return null;

		const setState = stateManager.setSelfState.bind(null, id);
		const setExtState = (idTarget, newState) => {
			if (idTarget.includes('||'))
				idTarget = getScopedId(idTarget, id);

			stateManager.setWgtState(idTarget, newState, id)
		};

		const registerFlows = flows => {
			register(flows, id, props);
		};

		const children = _children
			? Array.isArray(_children)
				? _children.map((child, i) =>
					React.isValidElement(child)
						? React.cloneElement(child, { key: `child_${i}`, parentId: id })
						: child
				  )
				: React.isValidElement(_children)
					? React.cloneElement(_children, { parentId: id })
					: _children
			: null;

		return (
			<ComponentToRender
				{...props}
				state={cpnState}
				setState={setState}
				setExtState={setExtState}
				registerFlows={registerFlows}
				Child={mda => {
					return (
						<Wrapper
							key={mda.id}
							parentId={id}
							{...mda}
						/>
					);
				}}
			>
				{children}
			</ComponentToRender>
		);

	};
};

export default OC;
