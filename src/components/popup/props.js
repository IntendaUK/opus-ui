/* eslint-disable max-len */

import internalProps from './internalProps';

const props = {
	display: {
		type: 'boolean',
		desc: 'An indicator used to unbind events if already bound'
	},
	domNode: {
		type: 'HTMLElement',
		desc: 'The node that was clicked on'
	},
	fromId: {
		type: 'string',
		desc: 'The ID of the component that caused the popup to display'
	},
	lookupFlows: {
		type: 'array',
		desc: 'A list of flows that should be applied to the lookup'
	},
	lookupFilters: {
		type: 'array',
		desc: 'A list filters that should be applied to the lookup'
	},
	lookupData: {
		type: 'array',
		desc: 'Data for the lookup'
	},
	lookupWgts: {
		type: 'array',
		desc: 'Wgts for the lookup'
	},
	lookupPrps: {
		type: 'object',
		desc: 'Extra lookup props'
	},
	lookupDtaObj: {
		type: 'string',
		desc: 'The path pointing to the lookup data'
	},
	lookupStyleOverrides: {
		type: 'object',
		desc: 'An object containing styles to apply to the popup grid\'s container div',
		spec: {
			anyCssAttribute: 'This will be applied directly to the containing div',
			width: 'This attribute has extra functionality. Setting this will recalculate the \'left\' position of the popup so as to center it given the desired width',
			overrideMinHeight: 'While it IS possible to override the \'minHeight\' style attribute, this will not be sufficient to cater for situations when the popup overflows the window border. In these cases, the \'overrideMinHeight\' attribute should be overriden to properly recalculate the top position in these cases'
		}
	},
	handlerOnOptionClick: {
		type: 'function',
		desc: 'The handler function to be executed on option click'
	}
};

export default Object.assign(props, internalProps);
