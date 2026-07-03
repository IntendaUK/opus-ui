import React, { useState, useRef, useEffect } from 'react';

import { Wrapper } from './system/wrapper/wrapper';

import { generateGuid } from './system/helpers';

//The runtime mounts metadata on the assumption that it OWNS a fresh, per-mount copy it may freely
// mutate in place - it resolves scoped flow ids onto the flow objects, rewrites morph props, applies
// prop-spec defaults, assigns generated ids, etc. The JSON path upholds this because dynamic
// components are deep-cloned per mount in WrapperDynamic (clone({}, initialMda)). A transpiled
// component, however, hands the engine its `prps` as a MODULE-LEVEL literal shared by reference
// across every mount and every instance, and (being static) mounts through WrapperInner, which does
// not clone. Those in-place mutations then leak back into the shared literal and corrupt later
// mounts - e.g. a viewport reopened after a close inherited the previous instance's resolved flow
// scope/target ids and never received its input value. We give each transpiled component its own
// per-mount copy of prps here so the engine's ownership assumption holds for the JSX path too.
//
// Unlike the generic `clone` helper, this preserves functions AND React elements by reference (the
// engine never mutates those, and deep-copying a React element would strip its $$typeof Symbol and
// break it); only plain data - where the mutations actually happen - is copied.
const cloneOwnedData = value => {
	if (value === null || typeof(value) !== 'object')
		return value;

	//React elements carry a $$typeof Symbol; copy them by reference so they stay valid.
	if (value.$$typeof !== undefined)
		return value;

	if (Array.isArray(value))
		return value.map(cloneOwnedData);

	const result = {};
	for (const key in value) {
		if (Object.prototype.hasOwnProperty.call(value, key))
			result[key] = cloneOwnedData(value[key]);
	}

	return result;
};

//Deep structural comparison for source prps, with the same function/React-element handling as
// cloneOwnedData: functions and React elements (anything carrying $$typeof) are compared by
// reference and never recursed into - the engine treats them as opaque, and deep-walking a React
// element would hit its circular _owner -> Fiber back-references. Everything else (the plain data
// where genuine changes happen) is compared structurally with early exit.
const ownedPrpsChanged = (a, b) => {
	if (a === b)
		return false;

	if (a === null || b === null || a === undefined || b === undefined)
		return a !== b;

	const ta = typeof(a);
	if (ta !== typeof(b))
		return true;

	//Primitives and functions: value/reference compare (functions are opaque).
	if (ta !== 'object')
		return a !== b;

	//React elements: compare by reference (see note above); they are preserved by reference in
	// cloneOwnedData, so an unchanged element is the same reference and exits at the top.
	if (a.$$typeof !== undefined || b.$$typeof !== undefined)
		return a !== b;

	const aArr = Array.isArray(a);
	if (aArr !== Array.isArray(b))
		return true;

	if (aArr) {
		if (a.length !== b.length)
			return true;

		for (let i = 0; i < a.length; i++)
			if (ownedPrpsChanged(a[i], b[i]))
				return true;

		return false;
	}

	const ka = Object.keys(a);
	const kb = Object.keys(b);

	if (ka.length !== kb.length)
		return true;

	for (let i = 0; i < ka.length; i++) {
		const k = ka[i];

		if (!(k in b))
			return true;

		if (ownedPrpsChanged(a[k], b[k]))
			return true;
	}

	return false;
};

//Clone prps per mount, and RE-clone whenever the incoming source prps content changes.
//
// We must own a copy because the engine mutates prps in place (resolving flow ids, applying
// prop-spec defaults, etc.) and the transpiler hands us a module-level literal shared across mounts;
// owning isolates those mutations from the shared literal. But owning only ONCE froze every
// transpiled component's prps at first mount: a reused component handed new prps (e.g. a repeater
// row whose `data` is re-baked when the parent repeater rebuilds) kept its first snapshot forever,
// so its rows never appeared. We now compare the incoming SOURCE prps (not our mutated owned copy)
// against the source we last cloned from, and re-own on a genuine change. That fresh mda then flows
// through Wrapper -> mdaChanged -> onNewProps, which re-syncs the changed auth props - the same
// reactive path the JSON runtime uses for its rows. Content-stable prps (the common case) early-exit
// the compare and keep the existing owned copy, preserving the engine's in-place mutations.
const useOwnedPrps = prps => {
	const ref = useRef(null);

	if (
		ref.current === null ||
		(ref.current.source !== prps && ownedPrpsChanged(ref.current.source, prps))
	) {
		ref.current = {
			source: prps,
			prps: prps === undefined ? undefined : cloneOwnedData(prps)
		};
	}

	return ref.current.prps;
};

const prepareChildren = (_children, parentId) => {
	if (!_children) {
		return null;
	}

	const cloneIfCustom = (el, key) => {
		if (!React.isValidElement(el)) {
			return el;
		}

		// If it's a Fragment, strip it and push props down to its children
		if (el.type === React.Fragment) {
			return prepareChildren(el.props?.children, parentId);
		}

		// Only inject props into custom components (keep your original behavior)
		if (typeof el.type !== 'string') {
			return React.cloneElement(el, { key, parentId });
		}

		// If you ALSO want keys on DOM elements, clone here too.
		return el;
	};

	const flatten = (arr) => {
		return arr.flatMap((x) => (Array.isArray(x) ? x : [x]));
	};

	if (Array.isArray(_children)) {
		//There might be children with conditions that resolve to false so filter those out
		const mapped = _children
			.filter(c => !!c)
			.map((child, i) => {
				const key = child.props?.id ?? generateGuid();
				return cloneIfCustom(child, key);
			});

		// Fragments may return arrays, so flatten once.
		return flatten(mapped);
	}

	// Single child
	const single = cloneIfCustom(_children, undefined);

	// If it was a Fragment, you may get back an array of children, so return as-is.
	return single;
};

export const makeComponent = type => {
	return ({ id, scope, relId, prps, container, parentId, auth, children, wgts }) => {
		const guidRef = useRef(id || generateGuid());
		const resolvedId = guidRef.current;

		const ownedPrps = useOwnedPrps(prps);

		if (scope) {
			if (!Array.isArray(scope))
				scope = [scope];

			scope = [...new Set(scope.flat())];
		}

		return (
			<Wrapper
				mda={{
					id: resolvedId,
					scope,
					relId,
					parentId,
					type,
					container,
					prps: ownedPrps,
					auth
				}}
				children={children ?? wgts}
			/>
		);
	};
};

export const makeComponentWithChildren = type => {
	return ({ children: _children, id, scope, relId, prps, container, parentId, auth, wgts }) => {
		const guidRef = useRef(id || generateGuid());
		const resolvedId = guidRef.current;

		const ownedPrps = useOwnedPrps(prps);

		const [ready, setReady] = useState(false);
		const [result, setResult] = useState(null);

		useEffect(() => {
			const children = prepareChildren(_children, resolvedId);

			setResult({ resolvedId, children });
			setReady(true);
		}, [_children, resolvedId]);

		if (scope) {
			if (!Array.isArray(scope))
				scope = [scope];

			scope = [...new Set(scope.flat())];
		}

		if (!ready)
			return null;

		const { children } = result;

		return (
			<Wrapper
				mda={{
					type,
					id: resolvedId,
					parentId,
					scope,
					relId,
					container,
					prps: ownedPrps,
					auth,
					wgts
				}}
				children={children}
			/>
		);
	};
};

export const Container = makeComponentWithChildren('container');
export const ContainerSimple = makeComponentWithChildren('containerSimple');

export const DataLoader = makeComponent('dataLoader');
export const Label = makeComponent('label');
export const Modal = makeComponent('modal');
export const Popup = makeComponent('popup');
export const Viewport = makeComponent('viewport');
