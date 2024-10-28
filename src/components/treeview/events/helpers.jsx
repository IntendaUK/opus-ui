/*
	Foreword: This file is a mess...
	Comments have been added to individual functions to assist future eyeballs and brains
*/

//External Helpers
import { generateGuid, getDeepProperty, clone } from '../../../library';

//A list of keys upon which the repeater should stop drilling into metadata
const stopDrillingKeys = ['rowMda'];

//Helpers

//This function replaces things like:
// {{rowData}}
// {{rowData.field.nestedField}}
// {{scopeOfRepeater.rowData}}
// With the exact value (so it does not stringify)
const directReplace = (obj, props, rowMdaScope, isOutsideScope = false) => {
	Object.entries(props).forEach(([k, v]) => {
		if (stopDrillingKeys.includes(k))
			isOutsideScope = true;

		if (typeof(v) === 'object' && v !== null) {
			directReplace(obj, v, rowMdaScope, isOutsideScope);

			return;
		}

		if (typeof(v) !== 'string')
			return;

		//If the value contains '{{scopeOfRepeater...}}' or '{{...}}' then we try replacing
		// The repeater scope is only added if we are currently outside of our own scope
		// which means, we're drilling into rowMda of a nested repeater
		const accessor = `{{${isOutsideScope ? rowMdaScope + '.' : ''}`;

		const checker = `${accessor}row`;
		const indexA = v.indexOf(checker);
		const indexB = v.indexOf('}}');

		if (indexA === 0 && indexB === v.length - 2) {
			const pathToValue = v.replace(accessor, '').replace('}}', '');

			props[k] = getDeepProperty(obj, pathToValue);
		} else if (indexA > -1 && indexB > -1) {
			const pathToValue = v.substring(indexA + 2, indexB);
			const replacer = JSON.stringify(getDeepProperty(obj, pathToValue));

			props[k] = `${v.substring(0, indexA)}${replacer}${v.substring(indexB + 2)}`;
		}
	});
};

//This function replaces things like:
// ((rowData))
// ((rowData.field.nestedField))
// ((scopeOfRepeater.rowData))
// With the string value
const replaceStringEntries = (obj, string, rowMdaScope, isOutsideScope = false) => {
	let result = string;
	let newValue = string;

	do {
		result = newValue;

		//This regex essentially means:
		// Check for ((rowData...)) if we are accessing our own rowMda
		// OR
		// Check for ((scopeOfRepeater.rowData...)) if we are drilling through a nested repeater's rowMda
		const regexString = `\\(\\(${isOutsideScope ? rowMdaScope + '\\.' : ''}[^(())>]*\\)\\)`;
		const regex = new RegExp(regexString, 'g');

		newValue = newValue.replace(regex, match => {
			const replacer = `((${isOutsideScope ? rowMdaScope + '.' : ''}`;
			const pathToValue = match.split(replacer).join('').split('))').join('');
			const replacement = getDeepProperty(obj, pathToValue);

			if (replacement === undefined) {
				//If we're accessing something that exists inside obj (like rowNumber or rowData.anything)
				// we should return undefined if the value does not exists.
				// But if we access something like state.id.key, don't return undefined
				const firstKey = pathToValue.split('.')[0];
				if (Object.keys(obj).includes(firstKey))
					return undefined;

				return match;
			}

			return replacement;
		});
	} while (result !== newValue);

	return result;
};

// This is designed to also iterate through arrays
const replacePrpEntries = (valuesObj, prps, rowMdaScope, isOutsideScope = false) => {
	Object.entries(prps).forEach(([key, value]) => {
		if (stopDrillingKeys.includes(key))
			isOutsideScope = true;

		if (typeof value === 'string')
			prps[key] = replaceStringEntries(valuesObj, value, rowMdaScope, isOutsideScope);
		else if (typeof value === 'object' && value !== null)
			replacePrpEntries(valuesObj, value, rowMdaScope, isOutsideScope);
	});
};

const buildRowDataConcat = rowData => {
	const rowDataConcat = clone({}, rowData);

	if (typeof rowData !== 'object' || rowData === null)
		return JSON.stringify(rowData);

	Object.entries(rowData).forEach(([k, v]) => {
		//Strip out all non alphanumeric characters and spaces from each value inside rowData
		rowDataConcat[k] = (v + '').replace(/[^A-Za-z0-9]/g, '');
	});

	return rowDataConcat;
};

const generateWrapperId = (rowData, wgtMda, valuesObj) => {
	const { id, rowPrps } = wgtMda;

	if (!id && (!rowPrps || !rowPrps.elementIdFormat))
		return generateGuid();

	const idString = replaceStringEntries(valuesObj, id || rowPrps.elementIdFormat);

	return idString;
};

const generateWrapperProps = (rowData, wgtMda, rowNumber, valuesObj, rowMdaScope) => {
	const { rowPrps = {} } = wgtMda;

	const wrapperProps = clone({}, wgtMda);

	replacePrpEntries(valuesObj, wrapperProps, rowMdaScope);
	directReplace(valuesObj, wrapperProps, rowMdaScope);

	wrapperProps.id = generateWrapperId(rowData, wgtMda, valuesObj);

	if (rowPrps.storeRowDataAs)
		wrapperProps.prps[rowPrps.storeRowDataAs] = rowData;

	return wrapperProps;
};

const generateHoverFlow = (from, wrapperProps, prop, value) => {
	return {
		from,
		fromKey: 'hovered',
		toKey: prop,
		mapFunction: v => v ? value : wrapperProps[prop]
	};
};

const generateValuesObject = ({ id: parentId }, rowData, wgtMda, rowNumber) => {
	const { rowPrps } = wgtMda;

	return {
		parentId,
		rowData,
		rowPrps,
		rowNumber,
		rowDataConcat: buildRowDataConcat(rowData)
	};
};

export const generateWrapperMda = (props, data, rowNumber, wgtMda, lastParentHoverId) => {
	const rowData = data[rowNumber];

	const { rowPrps = {}, hoverPrps, wgts } = wgtMda;

	if (rowPrps.ignoreForLastRow && rowNumber === data.length - 1)
		return null;

	const wrapperMda = clone({}, wgtMda);

	const rowMdaScope = props.state?.rowMdaScope ?? 'unset';

	const valuesObj = generateValuesObject(props, rowData, wgtMda, rowNumber);

	clone(wrapperMda, generateWrapperProps(rowData, wgtMda, rowNumber, valuesObj, rowMdaScope));

	if (wrapperMda?.prps?.canHover)
		lastParentHoverId = wrapperMda.id;

	if (wgts) {
		wrapperMda.wgts = wgts
			.map(childMda => generateWrapperMda(props, data, rowNumber, childMda, lastParentHoverId))
			.filter(c => !!c);
	}

	if (hoverPrps) {
		const from = lastParentHoverId || wrapperMda.id;

		Object.entries(hoverPrps).forEach(([prop, value]) => {
			wrapperMda.prps.flows.push(generateHoverFlow(from, wrapperMda.prps, prop, value));
		});
	}

	delete wrapperMda.hoverPrps;
	delete wrapperMda.rowPrps;

	return wrapperMda;
};
