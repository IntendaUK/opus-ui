//System
import { stateManager } from '../managers/stateManager';
import { getScopedId, getAllScopedIds } from '../managers/scopeManager';

//Helpers
import { runScript } from '../../components/scriptRunner/interface';
import { getVariable, setVariable } from '../../components/scriptRunner/actions/variableActions';
import { getFunctionResult } from '../../components/scriptRunner/functions/functionManager';
import createFlowAction from '../../components/scriptRunner/actions/createFlow';
import morphConfig, { getMorphedValue } from '../../components/scriptRunner/helpers/morphConfig';
import { resolveThemeAccessor } from '../managers/themeManager';

const wrappedScriptHandlerKey = Symbol.for('opus-ui.wrappedScriptHandler');

export const isWrappedScriptHandler = handler => handler?.[wrappedScriptHandlerKey] === true;

//Marks a handler as already conforming to the (morphedConfig, script, props) call signature so
// processAction invokes it directly instead of routing it through the vanilla-script adapter.
// Used by suites, whose bound handlers keep the legacy positional (params, a, { args }, c) contract.
export const markAsWrappedScriptHandler = handler => {
	Object.defineProperty(handler, wrappedScriptHandlerKey, {
		value: true
	});

	return handler;
};

export const wrapScriptHandlerInActions = ({ handler, script: wrapScript, ownerId: wrapOwnerId }) => {
	//[opus-diag] TEMPORARY logging — remove once the double-wrap source is found.
	if (isWrappedScriptHandler(handler)) {
		console.error('[opus-diag] wrapScriptHandlerInActions received an ALREADY-WRAPPED handler (double wrap)', {
			scriptId: wrapScript?.id,
			ownerId: wrapOwnerId ?? wrapScript?.ownerId,
			creationStack: new Error().stack
		});
	}

	const wrappedHandler = (morphedConfig, script, props) => {
		//[opus-diag] TEMPORARY logging — remove once the bad invocation is found.
		if (!props || !script) {
			console.error('[opus-diag] wrapped script handler invoked with missing script/props', {
				scriptMissing: script === undefined,
				propsMissing: props === undefined,
				scriptId: script?.id,
				ownerId: script?.ownerId,
				firstArgKeys: morphedConfig && typeof morphedConfig === 'object' ? Object.keys(morphedConfig) : morphedConfig,
				invocationStack: new Error().stack
			});
		}

		const { state: scriptRunnerState } = props;
		const { id: scriptId, ownerId } = script;
		const handlerConfig = Object.prototype.hasOwnProperty.call(morphedConfig, 'config') && morphedConfig.config !== undefined
			? morphedConfig.config
			: morphedConfig;

		//Optional scope: foreign-scope variable ops (setVariable with an explicit
		// scope config) write/read another script's store entries — same engine
		// semantics as the declarative actions.
		const getVariableHelper = (variableName, scope) => {
			const res = getVariable({
				scope: scope ?? scriptId,
				name: variableName
			}, script, { state: scriptRunnerState });

			return res;
		};

		const setVariableHelper = (variableName, value, scope) => {
			setVariable({
				scope: scope ?? scriptId,
				name: variableName,
				value
			}, script, { state: scriptRunnerState });
		};

		const triggeredFrom = getVariableHelper('triggeredFrom');

		const args = {
			...handlerConfig,
			getVariable: getVariableHelper,
			setVariable: setVariableHelper,
			triggeredFrom,
			ownerId,
			scriptId,
			resolveId: token => token.includes('||') ? getScopedId(token, ownerId) : token,
			//resolveScopedId action semantics: ALL matching ids as an array
			// (consumers drill .0), anchored at anchorId ?? ownerId.
			resolveIds: (token, anchorId) => getAllScopedIds(token, anchorId ?? ownerId),
			//State-interface-class helpers for converted vanilla scripts:
			getIdsWithTag: tag => stateManager.getWgtIdsWithTag(tag),
			createFlow: config => createFlowAction(config, script, props),
			//Live theme lookup — returns the RAW value (objects intact), unlike the
			// package-time text splice which can only represent scalars.
			theme: themePath => resolveThemeAccessor(`{theme.${themePath}}`),
			//Theme-function invocation ({{fn.name}} accessors): args arrive already
			// morphed by the generated code, mirroring morphConfig's fn branch.
			fn: (name, args) => getFunctionResult({ name, args }),
			//Evaluates one accessor string ({{state.x.y}}, ((sX.variable.z)), {{eval.…}},
			// ||scope.relId|| …) with the exact declarative-script semantics, at call time.
			morph: value => {
				if (typeof (value) === 'string')
					return getMorphedValue(value, script, props, true, undefined, {});

				return morphConfig(value, script, props, false, true);
			},
			setState: stateManager.setSelfState.bind(null, ownerId),
			setExternalState: (idTarget, newState) => {
				if (idTarget.includes('||'))
					idTarget = getScopedId(idTarget, ownerId);

				stateManager.setWgtState(idTarget, newState, ownerId);
			},
			getState: stateManager.getWgtState.bind(null, ownerId),
			getExternalState: idSource => {
				if (idSource.includes('||'))
					idSource = getScopedId(idSource, ownerId);

				return stateManager.getWgtState(idSource);
			},
			runScript,
			config: handlerConfig
		};

		return handler(args);
	};

	Object.defineProperty(wrappedHandler, wrappedScriptHandlerKey, {
		value: true
	});

	const res = [{
		handler: wrappedHandler
	}];

	return res;
};
