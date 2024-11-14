import { get as getSuite } from './store';

const run = ({ suite, method }) => {
	const entry = getSuite({
		suite,
		method
	});

	entry.handler();
};

export default run;
