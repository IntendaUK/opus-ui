/* eslint-disable max-len */

import chalk from 'chalk';

const logColor = parts => {
	let output = '';
	for (let i = 0; i < parts.length; i += 2) {
		const colorName = parts[i];
		const text = parts[i + 1] || '';
		const colorFunc = chalk[colorName];
		output += (typeof colorFunc === 'function' ? colorFunc(text) : text);
		if (i + 2 < parts.length)
			output += ' ';
	}

	/* eslint-disable-next-line no-console */
	console.log(output);
};

const getLineNumberOfError = lastStep => {
	const stack = lastStep.error.stack;
	const lines = stack.split('\n');

	for (const line of lines) {
		if (line.includes('.spec.js')) {
			const regex = /(.*\.spec\.js):(\d+):(\d+)/;
			const match = line.match(regex);
			if (match)
				return parseInt(match[2], 10);
		}
	}
};

let passCount = 0;
let failCount = 0;

class MyCustomReporter {
	onBegin (config, suite) {
		const numberOfTests = suite.allTests().length;
		const numberOfWorkers = config.metadata.actualWorkers;

		logColor(['cyanBright', `\nRunning ${numberOfTests} test${numberOfTests > 1 ? 's' : ''} using ${numberOfWorkers} worker${numberOfWorkers > 1 ? 's' : ''}\n`]);
	}

	onError (error) {
		console.log(error.message);
	}

	onTestEnd (
		{ title: testTitle, location: { file: testLocation }, parent: { parent: { title: browser } } },
		{ duration, status, steps }
	) {
		const testFile = testLocation
			.substr(testLocation.indexOf('tests') + 12)
			.replace('.spec.js', '');

		const durationInSeconds = ~~(duration / 100) / 10;

		if (status === 'passed') {
			passCount++;

			logColor(['green', `[✓ ${browser}]`, 'white', testTitle, 'gray', `[${testFile}]`, 'cyan', `(${durationInSeconds}s)`]);

			return;
		}

		failCount++;

		const lastStep = steps[steps.findIndex(f => f.title === 'After Hooks') - 1];
		const matcherResult = lastStep.error.matcherResult;
		const lineNumberOfError = getLineNumberOfError(lastStep);

		logColor(['red', `[x ${browser}]`, 'white', testTitle, 'gray', `[${testFile}:${lineNumberOfError}]`, 'cyan', `(${durationInSeconds}s)`]);

		logColor(['gray', ` → last selector: ${lastStep.title}`]);

		if (lastStep.category === 'expect')
			logColor(['gray', '  → expected', 'white', matcherResult.expected, 'gray', 'but got', 'white', matcherResult.actual]);
	}

	onEnd ({ duration }) {
		const durationInSeconds = ~~(duration / 100) / 10;

		if (passCount > 0)
			logColor(['greenBright', `\n${passCount}` + ' passed']);

		if (failCount > 0) {
			if (passCount > 0)
				logColor(['redBright', failCount + ' failed']);
			else
				logColor(['redBright', `\n${failCount}` + ' failed']);
		}

		logColor(['cyanBright', `\nTests ran for ${durationInSeconds}s\n`]);
	}
}

module.exports = MyCustomReporter;
