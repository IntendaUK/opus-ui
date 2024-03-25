import * as formatters from './formatters';

const allowedDelimeters = [' ', '/', '-', ':'];
const delimeterPlaceholder = '*';

const dateFormatter = (date, format) => {
	const delimeters = [];

	const sections = format
		.split('')
		.map(c => {
			if (allowedDelimeters.includes(c)) {
				delimeters.push(c);

				return delimeterPlaceholder;
			}

			return c;
		})
		.join('')
		.split(delimeterPlaceholder);

	let result = '';

	sections.forEach((s, i) => {
		if (s === '')
			return;

		result += formatters[s](date);

		if (i < delimeters.length)
			result += delimeters[i];
	});

	return result;
};

export default dateFormatter;
