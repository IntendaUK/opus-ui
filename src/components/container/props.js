/* eslint-disable max-lines, max-len */

//System
import opusConfig from '../../config';

//System Helpers
import { clone, generateGuid } from '../../system/helpers';

//Shared Props
import propsShared from './propsShared';

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

		setAction: (oldValue = [], newValue) => {
			if (!newValue) {
				if (opusConfig.env === 'development') {
					//eslint-disable-next-line no-console
					console.error({
						msg: 'Invalid value passed to [extraWgts]',
						args: { value: newValue === undefined ? newValue : JSON.stringify(JSON.parse(newValue)) }
					});
				} else {
					/* eslint-disable-next-line no-console */
					console.error('Invalid value passed to [extraWgts]');
				}

				return oldValue;
			}

			if (!newValue.push)
				newValue = [ newValue];

			newValue.forEach(mda => {
				const exists = oldValue.some(({ id }) => id === mda.id);
				if (exists)
					return;

				const cloned = clone({}, mda);
				if (!cloned.id)
					cloned.id = generateGuid();

				oldValue.push(cloned);
			});

			return oldValue;
		},

		deleteAction: (oldValue = [], deletedValue) => {
			if (!deletedValue.push)
				deletedValue = [ deletedValue];

			deletedValue.forEach(mda => {
				oldValue.spliceWhere(({ id }) => {
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
	}
};

export default Object.assign(
	props,
	propsShared
);

