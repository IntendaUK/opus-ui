import React, { useState, useRef, useEffect } from 'react';

import { Wrapper } from './system/wrapper/wrapper';

import { generateGuid } from './system/helpers';

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
		const mapped = _children.map((child, i) => {
			const key = `child_${i}`;
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
					prps,
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

		const [ready, setReady] = useState(false);
		const [result, setResult] = useState(null);

		if (id === 'bankRepeater-18')
			console.log(_children);

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
					prps,
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
