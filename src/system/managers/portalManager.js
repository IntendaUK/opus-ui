const GENERATED_PORTAL_ATTRIBUTE = 'data-opus-ui-generated-portal';

const generatedPortalContainers = new Map();

const createPortalContainer = id => {
	const element = document.createElement('div');

	element.id = id;
	element.setAttribute(GENERATED_PORTAL_ATTRIBUTE, '');
	document.body.appendChild(element);

	console.warn(
		`[Opus UI] Portal container "${id}" was not found. ` +
		'A fallback container was created under document.body.'
	);

	return element;
};

const getGeneratedEntry = (id, element) => {
	let entry = generatedPortalContainers.get(id);

	if (entry?.element !== element) {
		generatedPortalContainers.delete(id);
		entry = null;
	}

	if (!entry && element.hasAttribute(GENERATED_PORTAL_ATTRIBUTE)) {
		entry = {
			element,
			users: 0
		};
		generatedPortalContainers.set(id, entry);
	}

	return entry;
};

const acquirePortalContainer = id => {
	if (!id || typeof document === 'undefined' || !document.body)
		return null;

	let element = document.getElementById(id);
	if (!element)
		element = createPortalContainer(id);

	const entry = getGeneratedEntry(id, element);
	if (entry)
		entry.users++;

	return {
		id,
		element,
		generated: !!entry
	};
};

const releasePortalContainer = lease => {
	if (!lease?.generated)
		return;

	const entry = generatedPortalContainers.get(lease.id);
	if (!entry || entry.element !== lease.element)
		return;

	entry.users--;
	if (entry.users > 0)
		return;

	entry.element.remove();
	generatedPortalContainers.delete(lease.id);
};

export {
	GENERATED_PORTAL_ATTRIBUTE,
	acquirePortalContainer,
	releasePortalContainer
};
