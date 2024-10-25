const applyPropSpec = ({ prps = {}, id, type }, propSpec) => {
	//The first run ignores default values that are functions since
	// those must run after the initial defaults are applied.
	// An example of this is a component with no properties sent through:
	// It could have a default property of A='abc' and a property B with
	// a default function that returns 123 when A === 'abc'. Depending on the
	// order of input properties, it will function differently
	const defaultGeneratorFunctions = [];

	Object.entries(propSpec).forEach(entry => {
		const [prop, { dft }] = entry;
		const { [prop]: currentValue } = prps;

		if (currentValue !== undefined || dft === undefined)
			return;

		if (typeof (dft) === 'function') {
			defaultGeneratorFunctions.push(entry);

			return;
		}

		prps[prop] = dft;
	});

	// We store generated defaults inside staged props here and assign them later
	// so we don't allow cascading defaults
	const stagedProps = {};
	defaultGeneratorFunctions.forEach(([prop, { dft }]) => {
		const generatedDft = dft(prps, id, type);
		if (generatedDft !== undefined)
			stagedProps[prop] = generatedDft;
	});

	Object.assign(prps, stagedProps);

	return prps;
};

export default applyPropSpec;
