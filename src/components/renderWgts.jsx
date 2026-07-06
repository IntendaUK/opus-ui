//React
import React from 'react';

//Components
import wrapWidgets from './wrapWidgets';
import { Wrapper } from '../system/wrapper/wrapper';

//Default fallback for a raw MDA node that wrapWidgets can't render on its own — i.e. a node with no
// tagged component trait and no function type, such as a plain container or a string-trait node.
// Routing it through the Opus Wrapper renders it the same way the runtime renders any dynamically-typed
// node, so renderWgts handles ANY MDA shape, not only widgets that carry a transpiled component trait.
// Callers that already have a parent-bound ChildWgt (e.g. a treeview) can pass it in to preserve their
// parentId context for the fallback path; component-trait nodes never use ChildWgt either way.
const DefaultChildWgt = ({ mda }) => <Wrapper mda={mda} />;

//Shared helper for rendering a dynamic `wgts`/trait value whose runtime shape can be EITHER:
//   1. already-rendered React elements (a caller passed static MDA the transpiler turned into JSX), or
//   2. raw Opus MDA objects (`{ id, traits }`, single or array) built at runtime by a script/handler.
// Elements render as-is; raw MDA goes through wrapWidgets so each node becomes a real element
// (resolving a tagged component trait to its imported component). This mirrors how a container renders
// its wgts/extraWgts (getWgts -> wrapWidgets), so any render site that can't go through a container —
// the repeater grid's cells, the treeview's nodes, a drag-move drop placeholder, the transpiler's
// dynamic-wgts output — gets the same correct rendering by calling this, WITHOUT changing the
// Wrapper/traitManager engine.
const renderWgts = (value, ChildWgt = DefaultChildWgt) => {
	if (value === null || value === undefined)
		return null;

	//A single React element/fragment renders directly.
	if (React.isValidElement(value))
		return value;

	if (Array.isArray(value)) {
		//A list of already-rendered elements renders directly; anything else is raw Opus MDA.
		if (value.every(React.isValidElement))
			return value;

		return wrapWidgets({ ChildWgt, wgts: value });
	}

	//A lone raw MDA node.
	if (typeof value === 'object')
		return wrapWidgets({ ChildWgt, wgts: [value] });

	//A primitive (string/number) is already a valid React child.
	return value;
};

export default renderWgts;
