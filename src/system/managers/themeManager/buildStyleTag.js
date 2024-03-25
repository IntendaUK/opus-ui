//System Helpers
import { resolveThemeAccessor } from '../../managers/themeManager';

//Helpers
import convertHexToHsl from './convertHexToHsl';
import convertHexToRgb from './convertHexToRgb';

//Export
const buildStyleTag = (themeName, theme) => {
	const styleString = (
		':root {' +
		Object.entries(theme).reduce((p, [k, v]) => {
			const mappedV = resolveThemeAccessor(v);

			const varName = `--${themeName}-${k}`;
			let next = `${varName}: ${mappedV};`;
			if (mappedV[0] === '#') {
				const [h, s, l] = convertHexToHsl(mappedV);
				const [r, g, b] = convertHexToRgb(mappedV);

				next += `${varName}-hs: ${h}, ${s};`;
				next += `${varName}-l: ${l};`;
				next += `${varName}-rgb: ${r}, ${g}, ${b};`;
			}

			return p + next;
		}, '') +
		'}'
	);

	let el = document.getElementById(themeName);
	if (!el) {
		el = document.createElement('style');
		el.id = themeName;
		el.type = 'text/css';
		document.getElementsByTagName('head')[0].appendChild(el);
	} else {
		if (el.innerHTML === styleString)
			return el;

		el.removeChild(el.childNodes[0]);
	}

	el.appendChild(document.createTextNode(styleString));
};

export default buildStyleTag;
