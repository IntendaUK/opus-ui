import { subscribe as subscribeToEvent,	emitEvent } from './flowManager/index';

export const emit = (source, event, msg) => {
	const consumed = emitEvent(source, event, msg);

	if (consumed)
		msg.preventDefault();
};

export const subscribe = (event, source, ownerId, handler) => {
	const unsub = subscribeToEvent(source, ownerId, handler, event);

	return [unsub];
};

export const subscribeGlobal = (event, ownerId, handler) => {
	//Source is undefined so event will be global
	const unsub = subscribeToEvent(undefined, ownerId, handler, event);

	return [unsub];
};

const onKeyDown = e => {
	if (e.target.localName !== 'body')
		return;

	//Source is undefined so event will be global
	const consumed = emitEvent(undefined, 'onGlobalKeyDown', e);
	if (consumed)
		e.preventDefault();
};

export const init = () => {
	document.addEventListener('keydown', onKeyDown);
};
