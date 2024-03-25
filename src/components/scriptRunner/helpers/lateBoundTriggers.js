//System Helpers
import { getScopedId } from '../../../system/managers/scopeManager';

//Helpers
import { setDisposers, removeDisposer } from '../interface';

//Triggers
import * as triggers from '../triggers';

//Internal
const lateBoundTriggers = [];

//Helpers
export const register = trigger => lateBoundTriggers.push(trigger);

const triggerIsMatch = ({ config: { source }, script }, mountedId) => {
	const useSource = source ?? script.ownerId;

	const isScoped = useSource.includes('||');

	if (!isScoped) {
		if (mountedId !== useSource)
			return false;
	} else {
		const resolvedId = getScopedId(useSource, script.ownerId);
		if (resolvedId !== mountedId)
			return false;
	}

	return true;
};

export const lateBindTriggers = async id => {
	const promises = [];

	lateBoundTriggers.forEach(q => {
		const { config, props, script, context, boundTo } = q;

		if (boundTo[id] || !triggerIsMatch(q, id))
			return;

		boundTo[id] = { disposers: [] };

		const newConfig = {
			...config,
			source: id,
			lateBound: false
		};

		const fn = triggers[config.event];

		promises.push(new Promise(async res => {
			const disposers = await fn(newConfig, props, script, context);

			boundTo[id].disposers.push(...disposers);

			res({
				ownerId: script.ownerId,
				disposers
			});
		}));
	});

	const results = await Promise.all(promises);

	results.forEach(r => {
		if (!r.disposers.length)
			return;

		setDisposers(r.ownerId, r.disposers);
	});
};

export const disposeLateBoundTriggers = id => {
	lateBoundTriggers.forEach(q => {
		const { script, boundTo } = q;

		if (!boundTo[id])
			return;

		boundTo[id].disposers.forEach(d => {
			d();

			removeDisposer(script.ownerId, d);
		});

		delete boundTo[id];
	});
};
