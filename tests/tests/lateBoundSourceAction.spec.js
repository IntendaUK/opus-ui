//System
import { expect, test } from '@playwright/test';

const openLateBoundDashboard = async page => {
	await page.goto('http://localhost:3000/test.html');

	const viewportInput = page.locator('#inputViewportValue');
	await viewportInput.waitFor();
	const input = await viewportInput.evaluate(element => element.tagName.toLowerCase()) === 'input'
		? viewportInput
		: viewportInput.locator('input');

	await input.fill('lateBoundSourceAction');
	await expect(page.locator('#lateBoundSourceActionResult')).toHaveText('Pending');
};

test('hydrates a source action assigned to fireScript after mount', async ({ page }) => {
	await openLateBoundDashboard(page);

	await page.locator('#lateBoundSourceActionButton').click();

	await expect(page.locator('#lateBoundSourceActionResult')).toHaveText('Success');
});

test('hydrates a late-bound source action through the exported script runner', async ({ page }) => {
	await openLateBoundDashboard(page);

	await page.evaluate(async () => {
		const { runScript } = await import('/src/components/scriptRunner/interface.js');

		await runScript({
			id: 'lateBoundSourceActionScript',
			ownerId: 'lateBoundSourceActionButton',
			actions: [{
				srcAction: { path: 'actions/executeLateBoundSourceAction' }
			}]
		});
	});

	await expect(page.locator('#lateBoundSourceActionResult')).toHaveText('Success');
});
