/* eslint-disable max-len */

import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

const projects = [{
	name: 'chrome',
	use: {
		...devices['Desktop Chrome'],
		channel: 'chrome'
	}
}, {
	name: 'firefox',
	use: { ...devices['Desktop Firefox'] }
}, {
	name: 'safari',
	use: { ...devices['Desktop Safari'] }
}, {
	name: 'edge',
	use: {
		...devices['Desktop Edge'],
		channel: 'msedge'
	}
}];

if (isCI)
	projects.splice(2, 1);

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: isCI,
	retries: !isCI ? 2 : 0,
	workers: !isCI ? 1 : undefined,
	outputDir: './tests/results',
	//reporter: './tests/helpers/reporter.cjs',
	reporter: 'list',
	use: { trace: 'on-first-retry' },
	reportSlowTests: null,

	projects,

	webServer: isCI ? {
		command: 'cd tests/tests/app && node ../../../node_modules/@intenda/opus-ui-packager/src/packager.js --includePaths=true --generateTestIds=true && cd ../../../ && vite --port 3000',
		port: 3000
	} : {
		command: 'concurrently "vite --open test.html --port 3000" "cd tests/tests/app && nodemon ../../../node_modules/@intenda/opus-ui-packager/src/packager.js --includePaths=true --generateTestIds=true"',
		port: 3000
	}
});

