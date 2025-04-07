//React
import React, { useState, useEffect } from 'react';

//Opus System
import { stateManager } from '../managers/stateManager';
import { setExtraStates } from '../managers/stateManager/setWgtState';
import { getFullPropSpec } from '../managers/componentManager';
import { addNodeToDom, removeNodeFromDom, getScopedId } from '../managers/scopeManager';
import { registerScripts } from './helpers';
import { register, emitEvent, getInitialState, processQueue, destroyScope } from '../managers/flowManager/index';
import queueChanges from '../managers/flowManager/methods/queueChanges';
import { lateBindTriggers, disposeLateBoundTriggers } from '../../components/scriptRunner/helpers/lateBoundTriggers';
import { disposeScripts } from '../../components/scriptRunner/interface';
import { removeStyleTag } from './helpers/styleTags.js';
import { Wrapper } from './wrapper';
import { clone } from '../helpers';

//Opus Helpers
import { generateGuid } from '../helpers';
import { getVariable } from '../../components/scriptRunner/actions/variableActions';
import getNextScriptId from '../../components/scriptRunner/helpers/getNextScriptId';

export const wrapScriptHandlerInActions = ({ handler }) => {
	const res = [{
		handler: (morphedConfig, script, { state: scriptRunnerState }) => {
			const { id: scriptId, ownerId } = script;

			const getVariableHelper = variableName => {
				const res = getVariable({
					scope: scriptId,
					name: variableName
				}, script, { state: scriptRunnerState });

				return res;
			};

			const triggeredFrom = getVariableHelper('triggeredFrom');

			handler({
				getVariable: getVariableHelper,
				triggeredFrom,
				setState: stateManager.setSelfState.bind(null, ownerId),
				setExternalState: (idTarget, newState) => {
					if (idTarget.includes('||'))
						idTarget = getScopedId(idTarget, ownerId);

					stateManager.setWgtState(idTarget, newState, ownerId)
				},
				getState: stateManager.getWgtState.bind(null, ownerId),
				getExternalState: stateManager.getWgtState.bind(null)
			});
		}
	}];

	return res;
};

//Events
const onUnmount = (id, state) => {
	const path = state?.path;
	const traitMappings = state?.traitMappings;

	emitEvent(id, 'onUnmount', { full: { id } });

	stateManager.cleanupState(id, path, traitMappings);
	disposeLateBoundTriggers(id);
	disposeScripts(id);
	destroyScope(id);
	removeStyleTag(id);

	removeNodeFromDom({ id });
};

const onMount = (props, cpnState, setCpnState, forceRemount, propSpec) => {
	let needSetId = false;

	if (!cpnState.id) {
		needSetId = true;

		cpnState.id = generateGuid();
	}

	const fullPropSpec = {};
	clone(fullPropSpec, getFullPropSpec());

	if (propSpec)
		clone(fullPropSpec, propSpec);

	Object.entries(fullPropSpec).forEach(([k, v]) => {
		if (cpnState[k] === undefined && v.dft) {
			if (typeof(v.dft) === 'function')
				cpnState[k] = v.dft(cpnState);
			else
				cpnState[k] = v.dft;
		}
	});

	setExtraStates(fullPropSpec, cpnState);

	const { id, path, traitMappings } = cpnState;

	stateManager.initState(id, setCpnState, cpnState, path, traitMappings, forceRemount);

	addNodeToDom(cpnState);

	queueChanges(id, cpnState, [], cpnState);
	register(props.flows, id, props);

	if (needSetId)
		stateManager.setSelfState(id, { id, mounted: true });
	else
		stateManager.setSelfState(id, { mounted: true });


	if (props.wgts) {
		props.wgts.forEach(p => {
			if (!p.id)
				p.id = generateGuid();
		});
	}

	return onUnmount.bind(null, id, cpnState);
};

const onRunFlowChecker = (cpnState, setCpnState, mounted) => {
	if (!mounted)
		return;

	const { id } = cpnState;

	(async () => {
		const { scripts } = cpnState;

		if (scripts) {
			scripts.forEach(s => {
				const { handler } = s;

				if (!s.triggers) {
					s.triggers = [{ event: 'onMount ' }];
				}

				s.triggers.forEach(t => {
					if (!t.source)
						t.source = id;
				});

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
const WrapperExternal = (ComponentToRender, config) => {
	const forceRemount = config?.forceRemount;
	const propSpec = config?.propSpec;

	return (_props) => {
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

		useEffect(onMount.bind(null, props, cpnState, setCpnState, forceRemount, propSpec), []);
		useEffect(onRunFlowChecker.bind(null, cpnState, setCpnState, mounted), [mounted]);
		useEffect(processQueue.bind(null, id), [updates]);

		if (!mounted)
			return null;

		const setState = stateManager.setSelfState.bind(null, id);
		const setExternalState = (idTarget, newState) => {
			if (idTarget.includes('||'))
				idTarget = getScopedId(idTarget, id);

			stateManager.setWgtState(idTarget, newState, id)
		};

		const getExternalState = idTarget => {
			if (idTarget.includes('||'))
				idTarget = getScopedId(idTarget, id);

			stateManager.getWgtState(idTarget)
		};

		const registerFlows = flows => {
			register(flows, id, props);
		};

		const children = _children
			? Array.isArray(_children)
				? _children.map((child, i) =>
					React.isValidElement(child) && typeof child.type !== 'string'
						? React.cloneElement(child, { key: `child_${i}`, parentId: id })
						: child
				  )
				: React.isValidElement(_children) && typeof _children.type !== 'string'
					? React.cloneElement(_children, { parentId: id })
					: _children
			: null;

		return (
			<ComponentToRender
				key={id}
				id={id}
				{...props}
				state={cpnState}
				setState={setState}
				setExternalState={setExternalState}
				getExternalState={getExternalState}
				registerFlows={registerFlows}
				Child={props => {
					return (
						<Wrapper
							key={props.mda.id}
							parentId={id}
							{...props}
						/>
					);
				}}
			>
				{children}
			</ComponentToRender>
		);
	};
};

export default WrapperExternal;
