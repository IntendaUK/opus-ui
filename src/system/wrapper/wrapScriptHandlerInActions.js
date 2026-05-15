//System
import { stateManager } from '../managers/stateManager';
import { getScopedId } from '../managers/scopeManager';

//Helpers
import { runScript } from '../../components/scriptRunner/interface';
import { getVariable } from '../../components/scriptRunner/actions/variableActions';

const wrappedScriptHandlerKey = Symbol.for('opus-ui.wrappedScriptHandler');

export const isWrappedScriptHandler = handler => handler?.[wrappedScriptHandlerKey] === true;

export const wrapScriptHandlerInActions = ({ handler }) => {
	const wrappedHandler = (morphedConfig, script, { state: scriptRunnerState }) => {
		const { id: scriptId, ownerId } = script;
		const handlerConfig = Object.prototype.hasOwnProperty.call(morphedConfig, 'config') && morphedConfig.config !== undefined
			? morphedConfig.config
			: morphedConfig;

		const getVariableHelper = variableName => {
			const res = getVariable({
				scope: scriptId,
				name: variableName
			}, script, { state: scriptRunnerState });

			return res;
		};

		const triggeredFrom = getVariableHelper('triggeredFrom');

		const args = {
			...handlerConfig,
			getVariable: getVariableHelper,
			triggeredFrom,
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
