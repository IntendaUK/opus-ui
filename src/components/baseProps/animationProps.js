/* eslint-disable max-len */

//Props
const props = {
	animationName: {
		type: 'string',
		desc: 'A string containing the name of the animation that should be applied to the component',
		options: ['fadein', 'flip', 'rotate360'],
		cssAttr: 'animationName',
		cssAttrVal: true
	},
	animationDuration: {
		type: 'string',
		desc: 'The duration, in seconds that the animation should take to complete',
		spec: '1.5s',
		cssAttr: 'animationDuration',
		cssAttrVal: true
	},
	animationIterationCount: {
		type: 'mixed',
		desc: 'The amount of times that the animation should play. Can be an integer or "infinite"',
		cssAttr: 'animationIterationCount',
		cssAttrVal: true
	},
	animationTimingFunction: {
		type: 'string',
		desc: 'How an animation progresses through the duration of each cycle',
		cssAttr: 'animationTimingFunction',
		cssAttrVal: true
	},
	animationDelay: {
		type: 'string',
		desc: 'The duration, in seconds that the animation should be delayed before beginning',
		spec: '1.5s',
		cssAttr: 'animationDelay',
		cssAttrVal: true
	},
	animation: {
		type: 'string',
		desc: 'A string reperesenting the complete animation. Used as a shorthand. See examples here: https://www.w3schools.com/css/css3_animations.asp',
		cssAttr: 'animation',
		cssAttrVal: true
	},
	transform: {
		type: 'string',
		desc: 'A string defining transformations that can be applied to the component. Transformations must be separated by a space. See: https://developer.mozilla.org/en-US/docs/Web/CSS/transform',
		spec: 'scale(0.5) translate(-100%, -100%)',
		cssAttr: true,
		cssAttrVal: (transform, { rotate }) => {
			if (transform)
				return transform;

			const transformationsList = [];

			if (rotate)
				transformationsList.push(`rotate(${rotate}deg)`);

			return transformationsList.join(' ');
		},
		dft: ({ rotate }) => {
			if (!rotate)
				return;

			return '';
		}
	},
	transformOrigin: {
		type: 'string',
		desc: 'A string that defines the origin of an element\'s transformations. See examples here: https://www.w3schools.com/cssref/css3_pr_transform-origin.asp',
		cssAttr: true,
		cssAttrVal: true
	},
	transition: {
		type: 'string',
		desc: 'A string that defines in shorthand form the: transition-property, transition-duration, transition-timing-function and transition-delay. See examples here: https://www.w3schools.com/cssref/css3_pr_transition.asp',
		cssAttr: true,
		cssAttrVal: true
	},
	transitionDuration: {
		type: 'string',
		desc: 'A string representing a length of time a transition animation will take to complete. See examples here: https://www.w3schools.com/cssref/css3_pr_transition-duration.asp',
		cssAttr: true,
		cssAttrVal: true
	},
	transitionDelay: {
		type: 'string',
		desc: 'A string representing a length of time a transition animation will take to start. See examples here: https://www.w3schools.com/cssref/css3_pr_transition-delay.asp',
		cssAttr: true,
		cssAttrVal: true
	},
	transitionProperty: {
		type: 'string',
		desc: 'A string representing a property to which a transition effect will be applied. See examples here: https://www.w3schools.com/cssref/css3_pr_transition-property.asp',
		cssAttr: true,
		cssAttrVal: true
	},
	transitionTimingFunction: {
		type: 'string',
		desc: 'A string representing the timing function to be applied to transitions. See examples here: https://www.w3schools.com/cssref/css3_pr_transition-timing-function.asp',
		cssAttr: true,
		cssAttrVal: true
	}
};

export default props;
