const getFileDataUrl = async (config, script) => {
	return new Promise(res => {
		const { target = script.ownerId } = config;

		const el = document.getElementById(target);
		if (!el)
			res();

		const file = el.querySelector('input').files[0];

		if (!file)
			res();

		const reader = new FileReader();

		reader.readAsDataURL(file);

		reader.onload = () => res(reader.result);
	});
};

export default getFileDataUrl;
