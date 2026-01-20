/* eslint-disable max-lines-per-function */
/* eslint-disable max-lines, max-len */

//System
import opusConfig from '../../config';
import { AppContext } from '../../system/managers/appManager';

//System Helpers
import { clone, generateGuid } from '../../system/helpers';
import { applyTraits } from '../../system/managers/traitManager';
import spliceWhere from '../../system/helpers/spliceWhere';

//Shared Props
import propsShared from './propsShared';

//Helpers
const recurseAssignIds = obj => {
	if (!obj.id)
		obj.id = generateGuid();

	if (obj.wgts)
		obj.wgts.forEach(w => recurseAssignIds(w));
};

const recurseApplyTraits = obj => {
	if (obj.trait) {
		if (!obj.traits)
			obj.traits = [];

		obj.traits.push({
			trait: obj.trait,
			traitPrps: obj.traitPrps
		});

		delete obj.trait;
		delete obj.traitPrps;
	}

	while (obj.traits)
		applyTraits(obj, AppContext);

	if (obj.wgts)
		obj.wgts.forEach(w => recurseApplyTraits(w));
};

//Props
const props = {
	handlerOnScroll: {
		type: 'function',
		desc: 'The handler function to be executed on scroll'
	},
	canHover: {
		type: 'boolean',
		desc: 'When true, hover styles will be applied to the container',
		classMap: true
	},
	hoverPrps: {
		type: 'object',
		desc: 'A configuration object specifying which props should be set when hovering on and off the component',
		spec: {
			on: {
				prpsIcon: {
					value: 'content_copy',
					color: 'primary'
				}
			},
			off: {
				prpsIcon: {
					value: 'content_copy',
					color: 'secondaryText'
				}
			}
		}
	},
	canClick: {
		type: 'boolean',
		desc: 'When true, the container will be clickable',
		classMap: true
	},
	handlerOnClick: {
		type: 'function',
		desc: 'The handler function to be executed when the container is clicked'
	},
	fireScript: {
		type: 'object',
		desc: 'A script object which is passed to scriptRunner to be executed'
	},
	renderChildren: {
		type: 'boolean',
		desc: 'When this is false, child components won\'t be rendered',
		dft: true
	},
	renderChildrenWhenInvis: {
		type: 'boolean',
		desc: 'When this is false and the container is invisible (vis: false), child components won\'t be rendered. This property is overriden by renderChildren',
		dft: false
	},
	extraWgts: {
		type: 'mixed',
		desc: 'A single metadata object, or array of metadata objects that should be added to the container\'s list of children',
		dft: () => [],

		setAction: (
			oldValue = [],
			newValue,
			{
				recursivelyAssignExtraWgtIds,
				recursivelyApplyExtraWgtTraits
			}
		) => {
			if (!newValue) {
				if (opusConfig.env === 'development') {
					console.error({
						msg: 'Invalid value passed to [extraWgts]',
						args: { value: newValue === undefined ? newValue : JSON.stringify(JSON.parse(newValue)) }
					});
				} else

					console.error('Invalid value passed to [extraWgts]');

				return oldValue;
			}

			if (!newValue.push)
				newValue = [ newValue];

			newValue.forEach(mda => {
				const exists = oldValue.some(({ id }) => id === mda.id);
				if (exists)
					return;

				const cloned = clone({}, mda);

				if (recursivelyApplyExtraWgtTraits === true)
					recurseApplyTraits(cloned);

				if (recursivelyAssignExtraWgtIds === true)
					recurseAssignIds(cloned);
				else if (!cloned.id)
					cloned.id = generateGuid();

				oldValue.push(cloned);
			});

			return oldValue;
		},

		deleteAction: (oldValue = [], deletedValue) => {
			if (!deletedValue.push)
				deletedValue = [deletedValue];

			deletedValue.forEach(mda => {
				spliceWhere(oldValue, ({ id }) => {
					const doDelete = (
						id === mda.id ||
						mda.all ||
						(
							mda.idRegex &&
							(new RegExp(mda.idRegex, 'g')).test(id)
						)
					);

					return doDelete;
				});
			});

			return oldValue;
		}
	},
	recursivelyAssignExtraWgtIds: {
		type: 'boolean',
		desc: 'When true, assigning new extraWgts will cause the full metadata of the widgets to be recursed and given random id\'s if they do not already have id\'s (This happens after recursively applying traits, if recursivelyApplyExtraWgtTraits is set to true)'
	},
	recursivelyApplyExtraWgtTraits: {
		type: 'boolean',
		desc: 'When true, assigning new extraWgts will cause the all traits to be applied (This happens before recursivley assigning id\'s if recursivelyAssignExtraWgtIds is set to true)'
	},
	clicked: {
		type: 'boolean',
		desc: 'An internal prop used to fire the clicked handler',
		internal: true
	},
	hovered: {
		type: 'boolean',
		desc: 'When true, the container is being hovered on',
		internal: true,
		dft: ({ canHover }) => canHover ? false : undefined
	},
	includeClickedArgs: {
		type: 'array',
		desc: 'When set, defines extra properties to set as the "clickedArgs" variable when running the fireScript for a clickable container',
		spec: ['mousePos']
	},
	contextMenuOpened: {
		type: 'boolean',
		desc: 'When opening a context menu, this will be set to true, then automatically be set back to false',
		internal: true
	}
};

export default Object.assign(
	props,
	propsShared
);

