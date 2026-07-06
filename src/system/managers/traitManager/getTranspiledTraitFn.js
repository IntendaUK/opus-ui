//Detects a trait reference the transpiler resolved to a direct module import — a FUNCTION rather than
// a path string the runtime must look up from JSON metadata (app.json). The transpiler emits such a
// reference as either { trait: fn } (the MDA trait-entry shape) or { type: fn } (the render-MDA shape),
// and occasionally as a bare function. Returns the function (a component trait OR a functional trait)
// or null for path-string, inline trait-object, and data-token ({{...}}) references — which the caller
// resolves the legacy way.
//
// This is the contract between transpiler output and the runtime trait appliers (traitManager,
// wrapWidgets, the repeater): anything this returns is a transpiled module to apply directly.
const getTranspiledTraitFn = traitEntry => {
	if (typeof(traitEntry) === 'function')
		return traitEntry;

	if (!traitEntry || typeof(traitEntry) !== 'object')
		return null;

	if (typeof(traitEntry.trait) === 'function')
		return traitEntry.trait;

	if (typeof(traitEntry.type) === 'function')
		return traitEntry.type;

	return null;
};

export default getTranspiledTraitFn;
