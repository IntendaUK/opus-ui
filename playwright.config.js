/* eslint-disable max-len */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	outputDir: './tests/results',
	//reporter: './tests/helpers/reporter.cjs',
	reporter: 'list',
	use: { trace: 'on-first-retry' },
	reportSlowTests: null,

	projects: [{
		name: 'chrome',
		use: {
			...devices['Desktop Chrome'],
			channel: 'chrome'
		}
	},
	{
		name: 'firefox',
		use: { ...devices['Desktop Firefox'] }
	},
	{
		name: 'safari',
		use: { ...devices['Desktop Safari'] }
	}, {
		name: 'edge',
		use: {
			...devices['Desktop Edge'],
			channel: 'msedge'
		}
	}],

	webServer: {
		command: 'concurrently "vite --open test.html --port 3000" "cd tests/tests/app && nodemon ../../../node_modules/@intenda/opus-ui-packager/src/packager.js --includePaths=true --generateTestIds=true"',
		port: 3000
	}
});

