//External Helpers
import performRequest from './performRequest';
import { getDeepProperty } from '../../../system/helpers';

//Config
import { setVariable } from './variableActions';

//Cache
import { getCache, setCache } from './actionCacheActions';

//Helpers
const saveResultInScriptVariables = (extractors, script, scriptProps, requestResponse) => {
	extractors.forEach(({ path, variable: name }) => {
		const value = getDeepProperty(requestResponse, path);

		if (value === undefined)
			return;

		setVariable({
			name,
			value
		}, script, scriptProps);
	});
};

const saveResultInState = (action, script, scriptProps, requestResponse) => {
	const { getWgtState, setWgtState } = scriptProps;
	const { saveToStateKey, saveToStateSubKey, target } = action;

	const data = requestResponse.response.result[0].serviceresult.response;

	if (data && data[0] && data[0].error)
		return null;

	if (!saveToStateSubKey)
		setWgtState(target, { [saveToStateKey]: data });
	else {
		const currentPropData = getWgtState(target)[saveToStateKey];
		const newKeyPropData = {
			...currentPropData,
			[saveToStateSubKey]: data
		};
		setWgtState(target, { [saveToStateKey]: newKeyPropData });
	}
};

const buildBody = ({ body, bodyIsFormData }) => {
	if (!bodyIsFormData)
		return body;

	const result = new FormData();

	Object.entries(body).forEach(([k, v]) => {
		if (v[0] && v[0] instanceof Blob) {
			for (let vv of v)
				result.append(k, vv);

			return;
		}

		result.append(k, v);
	});

	return result;
};

/* eslint-disable-next-line max-lines-per-function */
const queryUrl = async (action, script, scriptProps) => {
	try {
		const { url, method, headers, cache, crossDomain } = action;
		const { extractAny, extractResults } = action;

		const body = buildBody(action);

		const request = {
			url,
			method,
			headers,
			body
		};

		if (crossDomain !== undefined)
			request.crossDomain = crossDomain;

		let response = null;
		if (cache) {
			response = getCache(request);

			if (response)
				response = response.res;
		}

		if (!response) {
			response = await performRequest(request);

			if (cache)
				setCache(request, response);
		}

		if (extractAny)
			saveResultInScriptVariables(extractAny, script, scriptProps, response);
		if (extractResults)
			saveResultInScriptVariables(extractResults, script, scriptProps, response);
		if (!extractAny && !extractResults)
			saveResultInState(action, script, scriptProps, response);
	} catch (e) {
		const { extractAny, extractErrors } = action;

		if (extractAny)
			saveResultInScriptVariables(extractAny, script, scriptProps, e);
		if (extractErrors)
			saveResultInScriptVariables(extractErrors, script, scriptProps, e);

		return null;
	}
};

export default queryUrl;
