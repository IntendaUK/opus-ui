//System
import { getMdaHelper } from '../../components/scriptRunner/actions/getMda/getMda';
import { wrapScriptHandlerInActions } from './wrapScriptHandlerInActions';

const getActionsArray = script => {
	const { actions } = script ?? {};

	if (!actions)
		return null;

	return Array.isArray(actions) ? actions : [actions];
};

const getSourceHandler = async path => {
	const handlerString = await getMdaHelper({
		type: 'dashboard',
		key: path,
		fileType: 'js'
	});

	const moduleUrl = `data:text/javascript;charset=utf-8,${encodeURIComponent(handlerString)}`;
	const handler = await import(/* @vite-ignore */ moduleUrl);

	return handler.default;
};

const hydrateSourceAction = async ({ action, script, ownerId }) => {
	const { srcAction, srcActions, ...rest } = action;
	const sourceAction = srcAction ?? srcActions;

	if (!sourceAction)
		return action;

	const handler = await getSourceHandler(sourceAction.path);

	const [ wrappedAction ] = wrapScriptHandlerInActions({
		script,
		ownerId,
		handler
	});

	return {
		...rest,
		...wrappedAction
	};
};

const hydrateActionTree = async ({ action, script, ownerId }) => {
	if (!action)
		return action;

	if (Array.isArray(action)) {
		return await Promise.all(
			action.map(entry => hydrateActionTree({
				action: entry,
				script,
				ownerId
			}))
		);
	}

	if (typeof (action) !== 'object')
		return action;

	const hydratedAction = await hydrateSourceAction({
		action,
		script,
		ownerId
	});

	await Promise.all(
		Object.entries(hydratedAction).map(async ([key, value]) => {
			if (!value || typeof (value) !== 'object')
				return;

			hydratedAction[key] = await hydrateActionTree({
				action: value,
				script,
				ownerId
			});
		})
	);

	return hydratedAction;
};

export const hydrateSourceActions = async ({ script, ownerId }) => {
	if (!script)
		return script;

	const srcActions = script.srcActions ?? script.srcAction;
	if (srcActions) {
		const handler = await getSourceHandler(srcActions.path);

		script.actions = wrapScriptHandlerInActions({
			script,
			ownerId,
			handler
		});
		delete script.srcActions;
		delete script.srcAction;
	}

	const actions = getActionsArray(script);
	if (!actions)
		return script;

	const hydratedActions = await hydrateActionTree({
		action: actions,
		script,
		ownerId
	});

	if (Array.isArray(script.actions))
		script.actions = hydratedActions;
	else
		script.actions = hydratedActions[0];

	return script;
};

export const hasSourceActionKey = value => {
	if (!value)
		return false;

	const frontier = [value];
	const seen = new Set();

	while (frontier.length) {
		const current = frontier.pop();
		if (!current || typeof (current) !== 'object')
			continue;

		if (seen.has(current))
			continue;

		seen.add(current);

		if (
			Object.hasOwn(current, 'srcAction') ||
			Object.hasOwn(current, 'srcActions')
		)
			return true;

		frontier.push(...Object.values(current));
	}

	return false;
};

export const hasSourceActions = script => hasSourceActionKey(script);
