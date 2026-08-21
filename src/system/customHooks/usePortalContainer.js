import { useEffect, useState } from 'react';

import {
	acquirePortalContainer,
	releasePortalContainer
} from '../managers/portalManager';

const findPortalContainer = id => {
	if (!id || typeof document === 'undefined')
		return null;

	return document.getElementById(id);
};

const usePortalContainer = id => {
	const [container, setContainer] = useState(() => ({
		id,
		element: findPortalContainer(id)
	}));

	useEffect(() => {
		const lease = acquirePortalContainer(id);

		setContainer({
			id,
			element: lease?.element ?? null
		});

		return () => releasePortalContainer(lease);
	}, [id]);

	if (container.id !== id)
		return null;

	return container.element;
};

export default usePortalContainer;
