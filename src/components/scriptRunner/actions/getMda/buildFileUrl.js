import { hostedMda } from '../../../../config';

const buildFileUrl = (type, key) => {
	let url = `${hostedMda}/${type}/${key}`;

	if (!(key.endsWith('.json')))
		url = url + '.json';

	return url;
};

export default buildFileUrl;
