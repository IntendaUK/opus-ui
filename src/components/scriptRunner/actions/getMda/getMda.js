/* eslint-disable max-lines */

//Plugins
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { mergeMap, retry } from 'rxjs/operators';

//System Helpers
import { getItem, addItem } from '../../../../system/managers/localStorageManager';
import { clone } from '../../../../system/helpers';
import buildFileUrl from './buildFileUrl';

//Config
import { useCachedMda, getMdaTimeoutMs, getMdaRetries } from '../../../../config';

const mdaPackage = {
	loaded: false,
	package: null
};

const namespaces = { contents: null };

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

export const getPackagedMda = (
	{ type, key, returnLabelWhenNotFound = true, fileType = 'json' }
) => {
	const accessor = `${type}/${key}.${fileType}`.split('/');

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
	const { type, key, cwd, fileType = 'setMdaPackage' } = action;

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
			key: action.key + '.' + fileType
		});

		if (cachedMda)
			return cachedMda;
	}

	const mda = getPackagedMda(action);

	if (mda && useCachedMda)
		addItem('mda', type, key, mda);

	return mda;
};

const setNamespaces = () => {
	namespaces.contents = {};

	const recurse = (obj, path = [], currentNamespace) => {
		if (obj.namespace !== undefined)
			currentNamespace = obj.namespace;

		const nodeNamespaces = obj['namespaces.json'];
		if (nodeNamespaces !== undefined) {
			Object.assign(namespaces.contents, nodeNamespaces);

			const foundEntry = Object.entries(nodeNamespaces).find(([, v]) => {
				return v.applyToAllChildren === true;
			});
			if (foundEntry)
				currentNamespace = foundEntry[0];
		}

		Object.entries(obj).forEach(([k, v]) => {
			const type = typeof(v);

			if (type !== 'object' || v === null || k === 'namespaces.json')
				return;

			if (v.prps !== undefined || v.traitPrps !== undefined || v.type !== undefined) {
				if (v.namespace === undefined)
					v.namespace = currentNamespace;

				return;
			}

			recurse(v, [...path, k], currentNamespace);
		});
	};

	recurse(mdaPackage.contents.dashboard);
};

const setMdaPackageDefault = () => {
	if (mdaPackage.contents !== undefined)
		return;

	mdaPackage.contents = {
		dashboard: {},
		data: {},
		theme: {}
	};
};

export const setMdaPackage = packageContents => {
	setMdaPackageDefault();

	clone(mdaPackage.contents, packageContents);

	mdaPackage.loaded = true;

	setNamespaces();
};

export const loadEnsemble = ({ name, ensemble }) => {
	setMdaPackageDefault();

	mdaPackage.contents.dashboard[name] = ensemble.dashboard;

	if (ensemble.themes) {
		Object.entries(ensemble.themes).forEach(([k, v]) => {
			if (mdaPackage.contents.theme[k])
				Object.assign(mdaPackage.contents.theme[k], v);
			else
				mdaPackage.contents.theme[k] = v;
		});
	}

	setNamespaces();
};

export const addMdaPackage = ({ path, contents }) => {
	setMdaPackageDefault();

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

	setNamespaces();
};

export const getMdaPackage = () => mdaPackage.contents;

export const setMdaAtPath = ({ type, key, mda, fileType = 'json' }) => {
	const accessor = `${type}/${key}.${fileType}`.split('/');

	let res = mdaPackage.contents;

	const lastEntry = accessor[accessor.length - 1];
	accessor.splice(accessor.length - 1, 1);

	accessor.forEach(a => {
		if (!res)
			return;

		if (!res[a])
			res[a] = {};

		res = res[a];
	});

	res[lastEntry] = mda;
};

export const getNamespace = name => {
	return namespaces.contents[name];
};
