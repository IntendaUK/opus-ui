//Helpers
import { ajax } from 'rxjs/ajax';

const performRequest = async (
	{
		url,
		method = 'GET',
		headers = { 'Content-Type': 'application/json' },
		body,
		crossDomain
	}
) => {
	const request = {
		url,
		method,
		headers,
		body
	};

	if (crossDomain !== undefined)
		request.crossDomain = crossDomain;

	return new Promise((res, reject) => {
		const startTime = (new Date()).getTime();

		ajax(request).subscribe(response => {
			const finishTime = (new Date()).getTime();

			const duration = finishTime - startTime;

			response.duration = duration;

			res(response);
		}, e => reject(e));
	});
};

export default performRequest;
