//Plugins
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { mergeMap, retry } from 'rxjs/operators';

//System Helpers
import { getItem, addItem } from '../../../../system/managers/localStorageManager';
import buildFileUrl from './buildFileUrl';

//Config
import { useCachedMda, getMdaTimeoutMs, getMdaRetries } from '../../../../config';

const mdaPackage = {
	loaded: false,
	package: null
};

//Helpers
export const getHostedMda = async ({ type, key }) => {
	const uri = buildFileUrl(type, key);

	return new Promise(res => {
		const pipe = ajax({
			url: uri,
			method: 'GET',
			timeout: getMdaTimeoutMs
		})
			.pipe(
				mergeMap(
					({ status, response: mda }) => {
						//If we get status 200 but no mda, it means the response wasn't valid JSON
						if (status === 200 && !mda) {
							const errorMsg = `'${key}' is not valid JSON`;

							//eslint-disable-next-line no-console
							console.error(errorMsg);

							return of({
								type: 'label',
								prps: { cpt: errorMsg }
							});
						}

						if (!mda)
							return of(null);

						return of(mda);
					}
				),
				retry(getMdaRetries)
			);

		pipe.subscribe({
			next: val => res(val),
			error: () => res(null)
		});
	});
};

export const getPackagedMda = ({ type, key, returnLabelWhenNotFound = true }) => {
	const accessor = `${type}/${key}.json`.split('/');

	let res = mdaPackage.contents;

	let errorMsg;

	accessor.forEach(a => {
		if (!res)
			return;

		res = res[a];
	});

	if (!res) {
		if (returnLabelWhenNotFound) {
			errorMsg = `'${key}' does not exist`;

			//eslint-disable-next-line no-console
			console.error(errorMsg);

			return {
				type: 'label',
				prps: { cpt: errorMsg }
			};
		}

		return null;
	}

	return res;
};

export const getMdaHelper = action => {
	const { type, key, cwd } = action;

	//Metadata can also be loaded using relative paths
	// This is supported for traits: "traits": ["./traits/1"]
	// It is also supported for viewports: "value": "./menuItems/1"]
	if (cwd && key.indexOf('./') === 0) {
		const folders = cwd.split('/');
		folders.pop();

		action.key = folders.join('/') + key.substr(1);
	}

	if (useCachedMda) {
		const cachedMda = getItem({
			type: 'mda',
			subType: type,
			key: action.key
		});

		if (cachedMda)
			return cachedMda;
	}

	const mda = getPackagedMda(action);

	if (mda && useCachedMda)
		addItem('mda', type, key, mda);

	return mda;
};

export const setMdaPackage = packageContents => {
	if (!mdaPackage.contents) {
		mdaPackage.contents = { dashboard: {}, theme: {} };
	}
	Object.entries(packageContents).forEach(([k, v]) => {
		Object.assign(mdaPackage.contents[k], v);
	});

	mdaPackage.loaded = true;
};

export const loadEnsemble = ({ name, ensemble }) => {
	if (!mdaPackage.contents)
		mdaPackage.contents = { dashboard: {}, theme: {} };

	mdaPackage.contents.dashboard[name] = ensemble.dashboard;

	if (ensemble.themes) {
		Object.entries(ensemble.themes).forEach(([k, v]) => {
			if (mdaPackage.contents.theme[k])
				Object.assign(mdaPackage.contents.theme[k], v);
			else
				mdaPackage.contents.theme[k] = v;
		});
	}
};

export const addMdaPackage = ({ path, contents }) => {
	if (!mdaPackage.contents)
		mdaPackage.contents = { dashboard: {}, theme: {} };

	contents = JSON.parse(
		JSON.stringify(contents)
			.replaceAll('%path%', path)
	);

	let accessor = mdaPackage.contents.dashboard;

	path.split('/').forEach(p => {
		if (!accessor[p])
			accessor[p] = {};

		accessor = accessor[p];
	});

	Object.entries(contents).forEach(([k, v]) => {
		accessor[`${k}.json`] = v;
	});
};

export const getMdaPackage = () => mdaPackage.contents;

export const setMdaAtPath = ({ type, key, mda }) => {
	const accessor = `${type}/${key}.json`.split('/');

	let res = mdaPackage.contents;

	const lastEntry = accessor[accessor.length - 1];
	accessor.splice(accessor.length - 1, 1);

	accessor.forEach(a => {
		if (!res)
			return;

		res = res[a];
	});

	res[lastEntry] = mda;
};
