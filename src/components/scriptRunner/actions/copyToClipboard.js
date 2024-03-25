/* eslint-disable no-console */
const fallBackCopyToClipboard = ({ value }) => {
	const root = document.getElementById('root');

	const el = document.createElement('textarea');
	el.style.opacity = 0;
	el.value = value;
	root.appendChild(el);

	el.select();
	el.setSelectionRange(0, 99999);

	document.execCommand('copy');
	root.removeChild(el);
};

const copyToClipboard = ({ value }) => {
	if (!navigator.clipboard) {
		fallBackCopyToClipboard(value);

		return;
	}
	navigator.clipboard.writeText(value);
};

export default copyToClipboard;
