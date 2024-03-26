export const removeStyleTag = id => {
	const el = document.getElementById('style-' + id);
	if (!el || !el.parentNode)
		return;

	el.parentNode.removeChild(el);
};

const buildCss = (id, styles, isOuter = false) => {
	let res = '';

	if (isOuter) {
		res = `[id="${id}"]${Object.keys(styles)[0]} {`;

		styles = Object.values(styles)[0];
	}

	const entries = Object.entries(styles);
	entries.forEach(([k, v]) => {
		const typeV = typeof(v);

		if (v === null || v === undefined)
			return;

		if (typeV === 'object')
			res += `${k} { ${buildCss(id, v)}`;
		else
			res += `${k}: ${v};`;
	});

	res = res + '}';

	return res;
};

export const buildStyleTag = (id, prefix, styles) => {
	if (!styles || !Object.keys(styles).length) {
		removeStyleTag(id);

		return;
	}

	const resultString = buildCss(id, styles, true);

	const elId = `style-${id}`;
	let el = document.getElementById(elId);

	if (el) {
		if (el.innerHTML === resultString)
			return el;

		el.removeChild(el.childNodes[0]);
	} else {
		el = document.createElement('style');
		el.id = elId;
		el.type = 'text/css';

		document.getElementsByTagName('head')[0].appendChild(el);
	}

	el.appendChild(document.createTextNode(resultString));

	return el;
};
