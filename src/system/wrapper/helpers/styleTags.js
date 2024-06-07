export const removeStyleTag = id => {
	const el = document.getElementById('style-' + id);
	if (!el || !el.parentNode)
		return;

	el.parentNode.removeChild(el);
};

const recurseCss = (parentSelector, resultObj, cssObj) => {
	const findEntry = selector => {
		let entry = resultObj[selector];
		if (!entry) {
			entry = {};

			resultObj[selector] = entry;
		}

		return entry;
	};

	Object.entries(cssObj).forEach(([k, v]) => {
		const type = typeof(v);

		if (v === undefined || v === null)
			return;
		else if (type === 'object') {
			let childSelector = parentSelector;

			if (k.indexOf('@keyframes') === 0 || k.indexOf('@media') === 0) {
				recurseCss(parentSelector, findEntry(k), v);

				return;
			} else if (k[0] === '&')
				childSelector += k.substr(1);
			else if (parentSelector === '')
				childSelector += k;
			else
				childSelector += ` ${k}`;

			recurseCss(childSelector, resultObj, v);

			return;
		}

		findEntry(parentSelector)[k] = v;
	});
};

const buildCssKeyframes = (selector, cssObj) => {
	const inner = Object.entries(cssObj)
		.map(([k, v]) => {
			const attributes = Object.entries(v)
				.map(([ik, iv]) => {
					return `\t\t${ik}: ${iv};`;
				})
				.join('\r\n');

			return `\t${k} {\r\n${attributes}\r\n\t}`;
		})
		.join('\r\n');

	const res = `${selector} {\r\n${inner}\r\n}`;

	return res;
};

const buildCssMediaQuery = (selectorPrefix, selector, cssObj) => {
	const selectorInner = Object.keys(cssObj)[0];

	const attributes = Object.entries(Object.values(cssObj)[0])
		.map(([ik, iv]) => {
			return `\t\t${ik}: ${iv};`;
		})
		.join('\r\n');

	/* eslint-disable-next-line max-len */
	return `${selector} {\r\n\t${selectorPrefix}${selectorInner} {\r\n${attributes}\r\n\t}\r\n}`;
};

const buildCss = (parentId, cssObj) => {
	const resultObj = {};

	const selectorPrefix = `[id="${parentId}"]`;

	recurseCss('', resultObj, cssObj);

	const res = Object.entries(resultObj)
		.map(([k, v]) => {
			if (k.indexOf('@keyframes') === 0)
				return buildCssKeyframes(k, v);
			else if (k.indexOf('@media') === 0)
				return buildCssMediaQuery(selectorPrefix, k, v);

			const attr = Object.entries(v)
				.map(([ik, iv]) => {
					return `\t${ik}: ${iv};`;
				})
				.join('\r\n');

			if (k.indexOf('@keyframes') === 0)
				return `${k} {\r\n${attr}\r\n}`;

			return `${selectorPrefix}${k} {\r\n${attr}\r\n}`;
		})
		.join('\r\n\r\n');

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
