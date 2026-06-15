/*
	Deep structural comparison with early exit.

	Used by Wrapper to detect whether a node's mda (its own props AND its
	descendants) changed since the last render, WITHOUT serializing the whole
	subtree to a string each render (the old JSON.stringify approach).

	It compares the live mda against a retained snapshot, so it still catches
	in-place key mutations. It returns true as soon as the first difference is
	found (added key, removed key, changed value, or changed type).
*/

const mdaChanged = (a, b) => {
	if (a === b)
		return false;

	if (a === null || b === null || a === undefined || b === undefined)
		return a !== b;

	const ta = typeof(a);
	if (ta !== typeof(b))
		return true;

	if (ta !== 'object')
		return a !== b;

	const aArr = Array.isArray(a);
	if (aArr !== Array.isArray(b))
		return true;

	if (aArr) {
		if (a.length !== b.length)
			return true;

		for (let i = 0; i < a.length; i++)
			if (mdaChanged(a[i], b[i]))
				return true;

		return false;
	}

	const ka = Object.keys(a);
	const kb = Object.keys(b);

	//Equal key count + every key of a present in b => identical key sets.
	// This catches added/removed keys without a second pass over b.
	if (ka.length !== kb.length)
		return true;

	for (let i = 0; i < ka.length; i++) {
		const k = ka[i];

		if (!(k in b))
			return true;

		if (mdaChanged(a[k], b[k]))
			return true;
	}

	return false;
};

export default mdaChanged;
