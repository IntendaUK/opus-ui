//System Helpers
import { clone, getDeepProperty } from '../../../system/helpers';

//External Helpers
import { applyComparison } from '../../scriptRunner/actions';

//Config
const transformations = { todayString: (new Date()).toString() };

//Helpers
const buildTransformedString = (value, transformValueTo, rowNumber, fullData) => {
	const record = fullData[rowNumber];

	let result = transformValueTo.replaceAll('((todayString))', transformations.todayString);
	result = result.replaceAll('((value))', value);
	result = result.replaceAll('((rowNumber))', rowNumber);
	result = result.replaceAll('((rowNumberNonZero))', rowNumber + 1);

	const regexString = '\\(\\(field\.(.*?)\\)\\)';
	const regex = new RegExp(regexString, 'g');

	while (result.includes && result.includes('((field.')) {
		result = result.replace(regex, (match, token) => {
			return getDeepProperty(record, token);
		});
	}

	return result;
};

const buildTransformedObject = (value, transformValueTo, rowNumber, fullData) => {
	const result = clone({}, transformValueTo);

	Object.entries(result).forEach(([k, v]) => {
		if (typeof(v) === 'object' && v !== null)
			result[k] = buildTransformedObject(value, v, rowNumber, fullData);
		else
			result[k] = buildTransformedString(value, v, rowNumber, fullData);
	});

	return result;
};

//Export
const applyDataTransformations = ({ state: { dataTransformations } }, data) => {
	//Just opt out ASAP
	if (!dataTransformations.length)
		return;

	const originalData = clone([], data);

	data.forEach((record, i) => {
		Object.entries(record).forEach(([k, v]) => {
			dataTransformations.forEach(transform => {
				const { field, match, transformValueTo } = transform;

				if (field !== '*' && field !== k)
					return;

				if (match) {
					const shouldTransform = match.every(m => {
						const config = { ...m };

						if (config.source === undefined && config.value === undefined)
							config.value = v;

						const doTransform = applyComparison(config);

						return doTransform;
					});

					if (!shouldTransform)
						return;
				}

				let xformed;

				if (typeof(transformValueTo) !== 'object')
					xformed = buildTransformedString(v, transformValueTo, i, originalData);
				else
					xformed = buildTransformedObject(v, transformValueTo, i, originalData);

				record[k] = xformed;
			});
		});
	});
};

export default applyDataTransformations;
