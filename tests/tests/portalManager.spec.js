//System
import { test, expect } from '@playwright/test';

const portalManagerPath = '/src/system/managers/portalManager.js';

test.beforeEach(async ({ page }) => {
	await page.goto('http://localhost:3000/test.html');
});

test('loads a targeted dashboardUri and creates its missing portal container', async ({ page }) => {
	const warnings = [];
	page.on('console', msg => {
		if (msg.type() === 'warning' && msg.text().startsWith('[Opus UI] Portal container'))
			warnings.push(msg.text());
	});

	const dashboardMda = {
		id: 'dashboardUriTarget',
		type: 'input',
		container: 'DASHBOARD_URI_PORTAL',
		prps: { placeholder: 'Targeted résumé ✓' }
	};
	const dashboardUri = Buffer.from(JSON.stringify(dashboardMda), 'utf8').toString('base64url');

	await page.goto(`http://localhost:3000/test.html?dashboardUri=${dashboardUri}`);

	const portal = page.locator('#DASHBOARD_URI_PORTAL');
	const input = page.locator('#dashboardUriTarget');

	await expect(portal).toHaveAttribute('data-opus-ui-generated-portal', '');
	await expect(input).toBeVisible();
	await expect(input).toHaveAttribute('placeholder', 'Targeted résumé ✓');
	expect(warnings).toEqual([
		'[Opus UI] Portal container "DASHBOARD_URI_PORTAL" was not found. ' +
		'A fallback container was created under document.body.'
	]);
});

test('creates, reuses, warns about, and cleans up missing portal containers', async ({ page }) => {
	const warnings = [];
	page.on('console', msg => {
		if (msg.type() === 'warning' && msg.text().startsWith('[Opus UI] Portal container'))
			warnings.push(msg.text());
	});

	const result = await page.evaluate(async path => {
		const {
			GENERATED_PORTAL_ATTRIBUTE,
			acquirePortalContainer,
			releasePortalContainer
		} = await import(path);
		const id = 'MISSING_TEST_PORTAL';
		const firstLease = acquirePortalContainer(id);
		const secondLease = acquirePortalContainer(id);
		const sameElementWasReused = firstLease.element === secondLease.element;
		const hasGeneratedMarker = firstLease.element.hasAttribute(GENERATED_PORTAL_ATTRIBUTE);

		releasePortalContainer(firstLease);
		const remainedForSecondUser = !!document.getElementById(id);

		releasePortalContainer(secondLease);

		return {
			sameElementWasReused,
			hasGeneratedMarker,
			remainedForSecondUser,
			wasRemovedAfterLastRelease: !document.getElementById(id)
		};
	}, portalManagerPath);

	expect(result).toEqual({
		sameElementWasReused: true,
		hasGeneratedMarker: true,
		remainedForSecondUser: true,
		wasRemovedAfterLastRelease: true
	});
	expect(warnings).toEqual([
		'[Opus UI] Portal container "MISSING_TEST_PORTAL" was not found. ' +
		'A fallback container was created under document.body.'
	]);
});

test('preserves application-owned portal containers without warning', async ({ page }) => {
	const warnings = [];
	page.on('console', msg => {
		if (msg.type() === 'warning' && msg.text().startsWith('[Opus UI] Portal container'))
			warnings.push(msg.text());
	});

	const result = await page.evaluate(async path => {
		const { acquirePortalContainer, releasePortalContainer } = await import(path);
		const element = document.createElement('div');

		element.id = 'APPLICATION_PORTAL';
		document.body.appendChild(element);

		const lease = acquirePortalContainer(element.id);
		releasePortalContainer(lease);

		const wasPreserved = document.getElementById(element.id) === element;
		element.remove();

		return wasPreserved;
	}, portalManagerPath);

	expect(result).toBe(true);
	expect(warnings).toEqual([]);
});
