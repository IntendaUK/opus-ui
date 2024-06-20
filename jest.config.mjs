export default {
	testTimeout: 20000,
	testEnvironment: 'node',
	moduleNameMapper: { '\\.(css|less|scss|sss|styl)$': '<rootDir>/node_modules/jest-css-modules' },
	transformIgnorePatterns: [
		'/node_modules/(?!react-native)/.+'
	]
};
