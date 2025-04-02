/* eslint-disable max-len, max-lines, max-lines-per-function */

//System
import { expect } from '@playwright/test';

//Internal
let page;
let testSteps;

//Setup
export const init = ({ page: _page }) => {
	page = _page;
};

//Helpers
const getEl = async locator => {
	if (locator[0] === '#') {
		if (!isNaN(+locator[1]))
			locator = `[id="${locator.substr(1)}"]`;
	} else if (locator[0] === '.') {
		if (!isNaN(+locator[1]))
			locator = `[class~="${locator.substr(1)}"]`;
	}

	const el = page.locator(locator);

	await el.waitFor();

	return el;
};

export const click = async ({ locator }) => {
	let el = await getEl(locator);

	const isClickable = await el.evaluate(element =>
		element.classList.contains('cpnContainer') || element.classList.contains('cpnButton')
	);

	if (!isClickable) {
		const childEl = el.locator('.cpnContainer, .cpnButton');
		await childEl.waitFor();
		el = childEl;
	}

	await el.click();

	return el;
};

export const exists = async ({ locator }) => {
	const el = await getEl(locator);

	return el;
};

export const textEquals = async ({ locator, options: [ expectedText ] }) => {
	const el = await getEl(locator);

	await expect(el).toHaveText(expectedText);

	return el;
};

export const valueEquals = async ({ locator, options: [expectedValue] }) => {
	let el = await getEl(locator);

	// Check if the element is an input
	const isInput = await el.evaluate(element => element.tagName.toLowerCase() === 'input');

	// If not an input, locate an input inside it
	if (!isInput) {
		const inputEl = el.locator('input');
		await inputEl.waitFor();
		el = inputEl;
	}

	// Check that the input value matches the expected value
	await expect(el).toHaveValue(expectedValue);

	return el;
};

export const type = async ({ locator, options: [ valueToType ] }) => {
	let el = await getEl(locator);

	const isInput = await el.evaluate(element => element.tagName.toLowerCase() === 'input');

	if (!isInput) {
		const inputEl = el.locator('input');
		await inputEl.waitFor();

		el = inputEl;
	}

	await el.fill(valueToType);

	return el;
};

const blur = async ({ locator, previousElement }) => {
	const el = locator ? await getEl(locator) : previousElement;
	await el.blur();

	return el;
};

const unmount = async ({ locator, previousElement }) => {
	if (!locator) {
		await previousElement.waitFor({ state: 'detached' });

		return previousElement;
	}

	await page.waitForSelector(locator, { state: 'detached' });
};

const hasClass = async ({ locator, options: [ expectedClass ] }) => {
	const el = await getEl(locator);

	await expect(el).toHaveClass(expectedClass);
};

const notHasClass = async ({ locator, options: [ unexpectedClass ] }) => {
	const el = await getEl(locator);

	await expect(el).not.toHaveClass(unexpectedClass);
};

const childCountEquals = async ({ locator, options: [ childCount ] }) => {
	await page.waitForFunction(
		({ locator: _locator, childCount: _childCount }) => {
			const element = document.querySelector(_locator);

			return element?.children?.length === +_childCount;
		},
		{
			locator,
			childCount
		}
	);
};

const notification = async ({ originalLocator: notificationType }) => {
	const el = await getEl(`#NOTIFICATIONS > .notification.${notificationType}`);

	await el.waitFor({ state: 'detached' });
};

const setState = async ({ locator, options: [ key, value ] }) => {
	const el = await getEl(locator);

	const id = await el.getAttribute('id');

	await testSteps([
		`type , ${id} , #stateSetter-target`,
		`type , ${key} , #stateSetter-key`,
		`type , ${value} , #stateSetter-value`,
		'click , #stateSetter-button'
	]);
};

const getState = async ({ locator, options: [ key, expectedValue ] }) => {
	const el = await getEl(locator);

	const id = await el.getAttribute('id');

	await testSteps([
		`type , ${id} , #stateGetter-target`,
		`type , ${key} , #stateGetter-key`,
		'click , #stateGetter-button',
		`valueEquals , ${expectedValue} , #stateGetter-value`
	]);
};

export const chooseDatePickerDate = async ({ locator, options: [chooseDate] }) => {
	const el = await getEl(locator);

	// Click the date picker element to open the calendar
	await el.click();

	// Wait for the date picker popup to appear
	const datePickerPopup = el.page().locator('.cpnDatePicker-popup');
	await datePickerPopup.waitFor();

	// Extract the target date components from chooseDate (YYYY/MM/DD)
	const [year, month, day] = chooseDate.split('/').map(Number);

	// Map of month names to their numeric value
	const monthMap = {
		January: 1,
		February: 2,
		March: 3,
		April: 4,
		May: 5,
		June: 6,
		July: 7,
		August: 8,
		September: 9,
		October: 10,
		November: 11,
		December: 12
	};

	// Get the month/year dropdown inside the popup
	const monthDropdown = datePickerPopup.locator('.monthDropdown');
	await monthDropdown.waitFor();

	// Loop until the month/year in the dropdown matches the target date
	let currentMonthYear = await monthDropdown.innerText();
	let [currentMonthName, currentYear] = currentMonthYear.split(', ');
	currentYear = Number(currentYear);
	let currentMonth = monthMap[currentMonthName];

	while (currentYear !== year || currentMonth !== month) {
		if (currentYear < year || (currentYear === year && currentMonth < month)) {
			// Go forward in time if the target date is in the future
			await datePickerPopup.locator('.monthNavigation .button:last-child').click();
		} else {
			// Go back in time if the target date is in the past
			await datePickerPopup.locator('.monthNavigation .button:first-child').click();
		}

		// Recheck the month and year after navigation
		currentMonthYear = await monthDropdown.innerText();
		[currentMonthName, currentYear] = currentMonthYear.split(', ');
		currentYear = Number(currentYear);
		currentMonth = monthMap[currentMonthName];
	}

	// Once the month and year match, select the correct day
	const dayLocator = datePickerPopup.locator('.datesBox .date', { hasText: String(day) });
	await dayLocator.waitFor();
	await dayLocator.click();

	// Wait for the popup to disappear after selecting the date
	await expect(datePickerPopup).toBeHidden();
};

//Internal
const helperLookup = {
	exists,
	click,
	type,
	textEquals,
	valueEquals,
	blur,
	unmount,
	childCountEquals,
	hasClass,
	notHasClass,
	notification,
	setState,
	ss: setState,
	getState,
	gs: getState,
	chooseDatePickerDate
};

//Helpers
const transformLocator = locator => {
	if (!locator)
		return;

	if (locator[0] === '(') {
		const indexClosingBrace = locator.indexOf(')');

		const testId = locator.substring(1, indexClosingBrace);

		locator = `[data-testid="${testId}"] ${locator.substr(indexClosingBrace + 1)}`;
	} else if (locator[0] !== '#' && locator[0] !== '.')
		locator = `[data-testid="${locator}"]`;

	return locator;
};

/*
	//Query Selectors (QS)
		#someId
			wait for element with id 'someId' to be mounted
		.someClass
			wait for element with class 'someClass' to be mounted
		someTestId
			wait for element with the data-testid attribute set to 'someTestId'
		someTestId with spaces
			wait for a span, inside a div, withing the element with data-testid attribute set to 'someTestId with spaces'
		(someTestId with spaces) div span
			wait for a span, inside a div, withing the element with data-testid attribute set to 'someTestId with spaces'
	//Actions
		click , QuerySelectorGoesHere
			waits for the query selector to be mounted then click on the element
		textEquals , ABC , QS
			waits for the query selector to be mounted then waits for the text inside  label  to equal ABC (case sensitive)
		valueEquals , ABC , QS
			waits for the input at the query selector to be mounted then waits for the value inside it to equal ABC (case sensitive)
		type , ABC , QS
			waits for the input at the query selector to be mounted then types the value ABC in it
			-> This works if QS is an input and also when QS has an input somewhere inside its children
		notification , success
			waits for a success notification to pop up
*/
testSteps = async steps => {
	let previousElement;

	for (let step of steps) {
		if (step === 'wait') {
			await new Promise(res => setTimeout(res, 1000));

			continue;
		}

		const split = step.split(' , ');
		if (split.length === 1 && !Object.keys(helperLookup).includes(split[0]))
			split.splice(0, 0, 'exists');

		const [ helperName, ...rest ] = split;
		const originalLocator = rest.pop();
		const locator = transformLocator(originalLocator);

		previousElement = await helperLookup[helperName]({
			locator,
			originalLocator,
			previousElement,
			options: rest
		});
	}
};

export { testSteps };

export const completeForm = async (initialFieldSelector, values) => {
	let currentInput = await getEl(transformLocator(initialFieldSelector));

	const isInput = await currentInput.evaluate(element => element.tagName.toLowerCase() === 'input');

	if (!isInput) {
		const inputEl = currentInput.locator('input');
		await inputEl.waitFor();

		currentInput = inputEl;
	}

	await currentInput.fill(values[0]);

	for (let i = 1; i < values.length; i++) {
		await currentInput.press('Tab');

		currentInput = page.locator(':focus');
		await currentInput.waitFor();

		await currentInput.fill(values[i]);
	}

	return values;
};
