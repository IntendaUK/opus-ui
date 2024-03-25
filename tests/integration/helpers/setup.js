import React from 'react';

import { configure } from '@testing-library/dom';
import { render, waitFor } from '@testing-library/react';

import { stateManager } from '../../../src/system/managers/stateManager';
import { reset as resetFlowManager } from '../../../src/system/managers/flowManager/index';

import AppLib, { registerComponentTypes } from '../../../src/library';

import { querySelector, querySelectorAll } from './querySelectorHelpers';

jest.mock('typeface-roboto', () => {
	return () => {
	};
});

import Input from '../../../src/testComponents/input';
import prpsInput from '../../../src/testComponents/input/props';

/*jest.mock('../../../src/config', () => ({
	mdaLocations: ['test'],
	dataLocations: ['test'],
	themeEntries: []
}));*/

const delayBetweenDomQueries = 500;

const originalError = console.error;
beforeAll(() => {
	configure({ asyncUtilTimeout: 5000 });

	console.error = (...args) => {
		if (
			/Warning.*not wrapped in act/.test(args[0]) ||
			/Warning.*Cannot update a component/.test(args[0]) ||
			/Warning.*Render methods should be a pure function of props and state/.test(args[0]) ||
			/Warning.*perform a React state update on an unmounted component/.test(args[0])
		)
			return;

		originalError.call(console, ...args);
	};

	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: jest.fn().mockImplementation(query => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: jest.fn(),
			removeListener: jest.fn(),
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
			dispatchEvent: jest.fn()
		}))
	});

	Object.defineProperty(window, 'FontFace', {
		writable: true,
		value: jest.fn().mockImplementation(() => ({ load: jest.fn() }))
	});

	Object.defineProperty(document, 'fonts', {
		writable: true,
		value: { add: jest.fn() }
	});

	Object.defineProperty(window, 'ResizeObserver', {
		writable: true,
		value: jest.fn().mockImplementation(() => ({ observe: () => {} }))
	});
});

afterAll(() => {
	console.error = originalError;
});

beforeEach(() => {
	resetFlowManager();
	stateManager.reset();

	const rootDiv = document.createElement('div');
	rootDiv.id = 'root';
});

export const getApp = async () => {
	const { App } = await import('../../../src/app');

	return App;
};

export const setupDashboard = async startupMda => {
	registerComponentTypes([{
		type: 'input',
		component: Input,
		propSpec: prpsInput
	}]);

	const res = render(
		<AppLib
			startupMda={startupMda}
		/>
	);

	/*const res = loadApp({
		mdaPackage,
		config: {
			env: 'development'
		},
		renderFunction: render,
		startupDashboardPath
	});*/

	return res;
};

export const awaitEl = async (container, selector) => {
	let el;

	await waitFor(() => {
		el = container.querySelector(selector);
		expect(el).toBeTruthy();
	});

	return el;
};

export const awaitElAll = async (container, selector) => {
	let els;

	await waitFor(() => {
		els = container.querySelectorAll(selector);
		expect(els.length).toBeGreaterThan(0);
	});

	return els;
};

export const awaitEls = async (container, selectors) => {
	const els = await Promise.all(selectors.map(s => {
		return new Promise(async res => {
			let el;

			await waitFor(() => {
				el = container.querySelector(s);
				expect(el).toBeTruthy();
			});

			res(el);
		});
	}));

	return els;
};

export const awaitElNth = async (container, selector, n) => {
	let el;

	await waitFor(() => {
		el = container.querySelectorAll(selector)[n];
		expect(el).toBeTruthy();
	}, { timeout: 10000 });

	return el;
};

export const awaitElCountEquals = async (container, selector, equals) => {
	let els;

	await waitFor(() => {
		els = container.querySelectorAll(selector);
		expect(els.length).toBe(equals);
	});

	return els;
};

export const getElText = el => {
	let split1 = el.outerHTML.split('>');
	split1.pop();

	let split2 = split1[(split1.length / 2)].split('<');

	return split2[0];
};

export const awaitSelector = async query => {
	return new Promise(res => {
		const check = () => {
			const found = querySelector(query);
			if (found) {
				res(found);

				return;
			}

			setTimeout(check, delayBetweenDomQueries);
		};

		check();
	});
};

export const awaitSelectorNth = async (query, getIndex) => {
	return new Promise(res => {
		const check = () => {
			const found = querySelectorAll(query);
			if (found && found[getIndex]) {
				res(found[getIndex]);

				return;
			}

			setTimeout(check, delayBetweenDomQueries);
		};

		check();
	});
};

export const awaitValueNot = async (query, notValue) => {
	const el = await awaitSelector(query);

	return new Promise(res => {
		const check = () => {
			const isOk = el.value !== notValue;
			if (isOk) {
				res(el.value);

				return;
			}

			setTimeout(check, delayBetweenDomQueries);
		};

		check();
	});
};

export const awaitSelectorReturnsNNodes = async (query, requiredNodeCount) => {
	return new Promise(res => {
		const check = () => {
			const found = querySelectorAll(query);
			if (found && found.length === requiredNodeCount) {
				res(requiredNodeCount);

				return;
			}

			setTimeout(check, delayBetweenDomQueries);
		};

		check();
	});
};

export const awaitChildCountNotEquals = async (query, childCount) => {
	const el = await awaitSelector(query);

	return new Promise(res => {
		const check = () => {
			const isOk = el.childElementCount !== childCount;
			if (isOk) {
				res(el.children);

				return;
			}

			setTimeout(check, delayBetweenDomQueries);
		};

		check();
	});
};

export const awaitElemPropertyNot = async (query, property, notValue) => {
	const el = await awaitSelector(query);

	return new Promise(res => {
		const check = () => {
			const isOk = el[property] !== notValue;
			if (isOk) {
				res(el[property]);

				return;
			}

			setTimeout(check, delayBetweenDomQueries);
		};

		check();
	});
};

//Use this method to check the innerText of elements.
// We need this because innerText is undefined when using jsdom with jest
export const awaitElemNthChildInnerTextNot = async (query, childIndex, notValue) => {
	const el = await awaitSelector(query);

	return new Promise(res => {
		const check = () => {
			if (el.childNodes.length <= childIndex) {
				setTimeout(check, delayBetweenDomQueries);

				return;
			}

			const isOk = el.childNodes[childIndex].textContent !== notValue;
			if (isOk) {
				res(el.childNodes[childIndex].textContent);

				return;
			}

			setTimeout(check, delayBetweenDomQueries);
		};

		check();
	});
};
