const config = {
	dataLocations: ['packaged'],

	hostedMda: 'http://localhost:5000',

	useCachedMda: false,

	getMdaTimeoutMs: 30 * 1000,
	getMdaRetries: 10,

	themeEntries: [],

	mdaPackageFileName: 'mdaPackage',

	env: 'production'
};

export const overrideConfig = overrides => {
	Object.assign(config, overrides);
};

if (window.envConfig)
	Object.assign(config, window.envConfig);

export const dataLocations = config.dataLocations;

export const hostedMda = config.hostedMda;

export const useCachedMda = config.useCachedMda;

export const getMdaTimeoutMs = config.getMdaTimeoutMs;
export const getMdaRetries = config.getMdaRetries;

export const themeEntries = config.themeEntries;
export const mdaPackageFileName = config.mdaPackageFileName;

export default config;
