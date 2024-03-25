module.exports = {
	testTimeout: 20000,
	setupFiles: [
		'jest-canvas-mock'
	],
	testEnvironment: 'jsdom',
	moduleNameMapper: { '\\.(css|less|scss|sss|styl)$': '<rootDir>/node_modules/jest-css-modules' },
	transformIgnorePatterns: [
		'/node_modules/(?!react-native)/.+'
	]
};
