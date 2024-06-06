const toBeNestedIndicator = '$toBeNested$';

export const removeStyleTag = id => {
	const el = document.getElementById('style-' + id);
	if (!el || !el.parentNode)
		return;

	el.parentNode.removeChild(el);
};

const recurseCss = (parentSelector, resultObj, cssObj) => {
	Object.entries(cssObj).forEach(([k, v]) => {
		const type = typeof(v);

		if (v === undefined || v === null)
			return;
		else if (type === 'object') {
			let childSelector = parentSelector;
			if (k[0] === '&')
				childSelector += k.substr(1);
			else if (k.indexOf('@media') === 0)
				childSelector = `${k}${toBeNestedIndicator}${parentSelector}`;
			else if (parentSelector === '')
				childSelector += k;
			else
				childSelector += ` ${k}`;

			recurseCss(childSelector, resultObj, v);

			return;
		}

		let entry = resultObj[parentSelector];
		if (!entry) {
			entry = {};

			resultObj[parentSelector] = entry;
		}

		entry[k] = v;
	});
};

/* eslint-disable-next-line max-lines-per-function */
const buildCss = (parentId, cssObj) => {
	const resultObj = {};

	const selectorPrefix = `[id="${parentId}"]`;

	recurseCss('', resultObj, cssObj);

	const res = Object.entries(resultObj)
		.map(([k, v]) => {
			if (k.includes(toBeNestedIndicator)) {
				const [selectorMedia, selectorInner] = k.split(toBeNestedIndicator);

				const attributes = Object.entries(v)
					.map(([ik, iv]) => {
						return `\t\t${ik}: ${iv};`;
					})
					.join('\r\n');

				/* eslint-disable-next-line max-len */
				return `${selectorMedia} {\r\n\t${selectorPrefix}${selectorInner} {\r\n${attributes}\r\n\t}\r\n}`;
			}

			const attr = Object.entries(v)
				.map(([ik, iv]) => {
					return `\t${ik}: ${iv};`;
				})
				.join('\r\n');

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
