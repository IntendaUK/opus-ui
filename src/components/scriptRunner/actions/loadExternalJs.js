const loadExternalJs = async config => {
	return new Promise(res => {
		const { src, attributes } = config;

		const s = document.createElement('script');

		s.onload = res;

		s.setAttribute('src', src);

		if (attributes) {
			Object.entries(attributes).forEach(([k, v]) => {
				s.setAttribute(k, v);
			});
		}

		document.head.appendChild(s);
	});
};

export default loadExternalJs;
