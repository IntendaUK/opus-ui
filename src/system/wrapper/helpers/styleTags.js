export const removeStyleTag = id => {
	const el = document.getElementById('style-' + id);
	if (!el || !el.parentNode)
		return;

	el.parentNode.removeChild(el);
};

const iterateTag = (result, selector, styles, themes) => {
	let innerResult = result[selector] = {};

	Object.entries(styles).forEach(([prop, val]) => {
		if (typeof(val) === 'object') {
			let morphedSelector = '';
			if (prop[0] === '&')
				morphedSelector = prop.substr(1);
			else
				morphedSelector = ' ' + prop;

			let innerSelector = selector + morphedSelector;
			iterateTag(result, innerSelector, val, themes);
		} else
			innerResult[prop] = val;
	});
};

const fixAnimations = styles => {
	Object.entries(styles)
		.filter(([prop]) => {
			return ['@', '%'].every(p => prop.indexOf(p) > -1);
		})
		.forEach(([prop, val]) => {
			delete styles[prop];

			const [prefix, animName, percentage] = prop.split(' ');
			styles[prefix + ' ' + animName][percentage] = val;
		});
};

const stringifyStyles = (prefix, styles) => {
	return Object.entries(styles).reduce((prev, [key, val]) => {
		return (
			prev +
			prefix +
			key +
			'{' +
			Object.entries(val).reduce((innerPrev, [prop, propValue]) => {
				let append = ': ' + propValue + ';';

				if (typeof(propValue) === 'object') {
					let mappedValue = JSON.stringify(propValue)
						.split('"')
						.join('')
						.split(',')
						.join(';');

					append = ' ' + mappedValue;
				}

				return innerPrev + prop + append;
			}, '') +
			'}'
		);
	}, '');
};

export const buildStyleTag = (id, prefix, styles, themes) => {
	if (!styles || !Object.keys(styles).length) {
		removeStyleTag(id);

		return;
	}

	let result = {};

	Object.entries(styles).forEach(([selector, innerStyles]) => {
		iterateTag(result, selector, innerStyles, themes);
	});

	fixAnimations(result);

	let resultString = stringifyStyles(prefix, result);

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
