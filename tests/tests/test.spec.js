
//System
import { test } from '@playwright/test';

//Helpers
import '../helpers/setup';
import { getRandomString } from '../helpers';
import { testSteps } from '../helpers/awaitLocatorActions';

test('Flows', async ({ page }) => {
	await testSteps([
		'type , flows , #inputViewportValue'
	]);

	await page.waitForFunction(() => {
		const elements = Array.from(document.querySelectorAll('.cpnLabel'));

		const filteredElements = elements.filter(el => el.textContent.trim().startsWith('<test>'));

		if (filteredElements.length === 0)
			return true;

		return filteredElements.every(el => el.textContent.trim() === '<test>success');
	}, { timeout: 30000 });
});

/*test('JSX Components', async ({ page }) => {
	await testSteps([
		'type , jsxComponents/index , #inputViewportValue'
	]);

	await page.waitForFunction(() => {
		const elements = Array.from(document.querySelectorAll('.cpnLabel'));

		const filteredElements = elements.filter(el => el.textContent.trim().startsWith('<test>'));

		if (filteredElements.length === 0)
			return true;

		return filteredElements.every(el => el.textContent.trim() === '<test>success');
	}, { timeout: 30000 });
});
*/
