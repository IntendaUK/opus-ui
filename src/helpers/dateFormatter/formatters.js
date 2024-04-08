//The formatters here follow the moment.js format
// Read more here: https://devhints.io/datetime

//Helpers
const format = (date, option, value) => {
	return date.toLocaleString('default', { [option]: value });
};

const formatComplex = (date, options) => {
	return date.toLocaleString('default', options);
};

//Formatters

//  Weekday

export const d = date => {
	return date.getDay();
};

export const dd = date => {
	return format(date, 'weekday', 'narrow');
};

export const ddd = date => {
	return format(date, 'weekday', 'short');
};

export const dddd = date => {
	return format(date, 'weekday', 'long');
};

//  Year

export const YY = date => {
	return format(date, 'year', '2-digit');
};

export const YYYY = date => {
	return format(date, 'year', 'numeric');
};

//  Month

export const M = date => {
	return format(date, 'month', 'numeric');
};

export const MM = date => {
	return format(date, 'month', '2-digit');
};

export const MMM = date => {
	return format(date, 'month', 'short');
};

export const MMMM = date => {
	return format(date, 'month', 'long');
};

//  Day

export const D = date => {
	return format(date, 'day', 'numeric');
};

export const DD = date => {
	return format(date, 'day', '2-digit');
};

//  24 Hour

export const H = date => {
	return formatComplex(date, {
		hour12: false,
		hour: 'numeric'
	});
};

export const HH = date => {
	return formatComplex(date, {
		hour12: false,
		hour: '2-digit'
	});
};

//  12 Hour

export const h = date => {
	return formatComplex(date, {
		hour12: true,
		hour: 'numeric'
	});
};

export const hh = date => {
	return formatComplex(date, {
		hour12: true,
		hour: '2-digit'
	});
};

//  Minute

export const m = date => {
	return format(date, 'minute', 'numeric');
};

export const mm = date => {
	return format(date, 'minute', '2-digit').padStart(2, '0');
};

//  Second

export const s = date => {
	return format(date, 'second', 'numeric');
};

export const ss = date => {
	return format(date, 'second', '2-digit').padStart(2, '0');
};

// AM / PM

export const A = date => {
	const hour = H(date);

	const result = hour < 12 ? 'AM' : 'PM';

	return result;
};

export const a = date => {
	const hour = H(date);

	const result = hour < 12 ? 'am' : 'pm';

	return result;
};
