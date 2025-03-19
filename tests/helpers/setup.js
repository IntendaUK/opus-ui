//System
import { test } from '@playwright/test';

//Helpers
import { init as initLocationActions } from './awaitLocatorActions';

//Setup
test.beforeEach(async ({ page }) => {
	await page.goto('http://localhost:3000/test.html');
	initLocationActions({ page });
});
