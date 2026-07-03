//System
import { stateManager } from '../managers/stateManager';
import { getScopedId } from '../managers/scopeManager';

//Helpers
import { runScript } from '../../components/scriptRunner/interface';
import { getVariable, setVariable } from '../../components/scriptRunner/actions/variableActions';
import morphConfig, { getMorphedValue } from '../../components/scriptRunner/helpers/morphConfig';

const wrappedScriptHandlerKey = Symbol.for('opus-ui.wrappedScriptHandler');

export const isWrappedScriptHandler = handler => handler?.[wrappedScriptHandlerKey] === true;

export const wrapScriptHandlerInActions = ({ handler }) => {
	const wrappedHandler = (morphedConfig, script, props) => {
		const { state: scriptRunnerState } = props;
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

		const setVariableHelper = (variableName, value) => {
			setVariable({
				scope: scriptId,
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
