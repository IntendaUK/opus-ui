const normalizeBase64 = value => {
	const normalized = value
		.replaceAll(' ', '+')
		.replaceAll('-', '+')
		.replaceAll('_', '/');
	const paddingLength = (4 - (normalized.length % 4)) % 4;

	return normalized.padEnd(normalized.length + paddingLength, '=');
};

const decodeDashboardUri = dashboardUri => {
	const binary = atob(normalizeBase64(dashboardUri));
	const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
	const serializedMda = new TextDecoder().decode(bytes);
	const dashboardMda = JSON.parse(serializedMda);

	if (!dashboardMda || Array.isArray(dashboardMda) || typeof dashboardMda !== 'object')
		throw new Error('dashboardUri must decode to a dashboard metadata object');

	return dashboardMda;
};

export default decodeDashboardUri;
