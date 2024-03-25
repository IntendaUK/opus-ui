/* eslint-disable max-len */

//This file contains props that are used by the dataLoader AND any component that
// can own a dataLoader (like a grid or repeater)

//Actions
import filtersSet from '../../props/actions/filtersSet';
import filtersDelete from '../../props/actions/filtersDelete';

//Props
const props = {
	filters: {
		type: 'array',
		desc: 'Filters for the dataLoader',
		spec: '[{key, value, !operator, !removable, !forceRemove}]',
		dft: () => [],
		internal: true,
		setAction: filtersSet,
		deleteAction: filtersDelete,
		serialize: true
	},
	offset: {
		type: 'integer',
		desc: 'The index of the first record that should be loaded',
		dft: 0
	},
	sortField: {
		type: 'string',
		desc: 'A string holding the name of the field that should be sorted'
	},
	sortAscending: {
		type: 'boolean',
		desc: 'When true, the data will be sorted in ascending order'
	},
	pageSize: {
		type: 'integer',
		desc: 'A number defining how many records should be shown at any time',
		dft: 100
	},
	staticData: {
		type: 'array',
		desc: 'The list of static data records that needs to be loaded'
	},
	dataObject: {
		type: 'string',
		desc: 'A string pointing to the path of the dataObject'
	},
	needsNewData: {
		type: 'boolean',
		desc: 'When true, a new data request will be performed'
	},
	deltaKeys: {
		type: 'array',
		desc: 'A list of delta keys that, when changed, reloads the dataLoader component',
		internal: true,
		dft: () => []
	},
	dtaScps: {
		type: 'array',
		desc: 'A list of actions that are used to fetch data'
	},
	recordCount: {
		type: 'number',
		desc: 'The total number of records',
		internal: true
	},
	dataTransformations: {
		type: 'array',
		desc: 'A list of fields that should have their values mapped to other values if comparison(s) (when present) evaluate to true',
		spec: [
			{
				field: 'The field (in the records) to check the value on',
				match: [
					{
						comparison: 'The comparison operator to apply',
						compareValue: 'The value to compare the record\'s field value to'
					}
				]
			}
		],
		dft: () => []
	}
};

export default props;
