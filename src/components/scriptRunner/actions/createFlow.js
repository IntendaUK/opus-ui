//System Helpers
import { clone, generateGuid } from '../../../system/helpers';

//Helpers
import { register, emit } from '../../../system/managers/flowManager/index';
import getTransformedFlows from '../../../system/managers/flowManager/helpers/getTransformedFlows';

//Config
const flowKeys = [
	'from',
	'fromList',
	'fromKey',
	'fromKeyList',
	'fromSubKey',
	'fromSubKeyList',
	'to',
	'toList',
	'toTag',
	'toKey',
	'toSubKey',
	'toKeyList',
	'mapFunctionString',
	'scope',
	'mapObject'
];

//Helpers
const buildFlow = (config, { ownerId }) => {
	let { scope, from, fromKey, fromKeyList, toKeyList } = config;

	config.scope = scope ?? generateGuid();
	config.from = from ?? ownerId;

	if (toKeyList !== undefined && fromKeyList === undefined && fromKey === undefined)
		config.fromKeyList = toKeyList.map(() => generateGuid());

	if (fromKey === undefined && fromKeyList === undefined)
		config.fromKey = generateGuid();

	const result = {};

	flowKeys.forEach(k => {
		const keyValue = config[k];

		if (keyValue !== undefined)
			result[k] = keyValue;
	});

	result.ownerId = ownerId;
	result.destroyOnConsume = config.scope === undefined;
	result.loadInitialValue = false;

	return result;
};

const emitEvents = ({ value, valueList }, flows, { getWgtState }) => {
	const emitList = [];

	flows.forEach((t, i) => {
		const { from, fromKey, fromSubKey } = t;

		const useValue = value ?? valueList?.[i];
		const fullFromState = getWgtState(from);

		const changed = {};
		if (useValue) {
			if (fromSubKey)
				changed[fromKey] = { [fromSubKey]: useValue };
			else
				changed[fromKey] = useValue;
		} else {
			if (!fullFromState)
				return;

			changed[fromKey] = fullFromState[fromKey];
		}

		const exists = emitList.find(f => f.from === from);
		if (exists) {
			clone(exists.msg.changed, changed);

			return;
		}

		emitList.push({
			from,
			msg: {
				changed,
				full: fullFromState
			}
		});
	});

	emitList.forEach(({ from, msg }) => emit(from, msg));
};

//Action
const createFlow = (config, script, props) => {
	const flow = buildFlow(config, script);

	const transformedFlows = getTransformedFlows([flow], script.ownerId);

	register(transformedFlows, script.ownerId);

	emitEvents(config, transformedFlows, props);
};

export default createFlow;
