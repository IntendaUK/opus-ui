
//System
import { test } from '@playwright/test';

//Helpers
import '../helpers/setup';
import { getRandomString } from '../helpers';
import { testSteps } from '../helpers/awaitLocatorActions';

test('aaa', async ({ page }) => {
	await page.waitForFunction(() => {
		const elements = Array.from(document.querySelectorAll('.cpnLabel'));

		return elements.length > 0 && elements.every(el => el.textContent.trim() === '<test>success');
	}, { timeout: 30000 });
});
