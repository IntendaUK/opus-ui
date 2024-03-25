const setPageFavicon = ({ path }) => {
	const favicon = document.getElementById('favicon');

	favicon.href = path;
};

export default setPageFavicon;
