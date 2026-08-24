//System
import { expect, test } from '@playwright/test';

//Helpers
import '../helpers/setup';
import { testSteps } from '../helpers/awaitLocatorActions';

test('hydrates a source action assigned to fireScript after mount', async ({ page }) => {
	await testSteps([
		'type , lateBoundSourceAction , #inputViewportValue'
	]);

	await page.locator('#lateBoundSourceActionButton').click();

	await expect(page.locator('#lateBoundSourceActionResult')).toHaveText('Success');
});
