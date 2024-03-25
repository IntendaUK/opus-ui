//Helpers
import { getMorphedValue } from './morphConfig';

const spreadActions = (script, actions, props) => {
	const spreadies = actions
		.filter(a => a.indexOf && a.indexOf('spread-') === 0);

	spreadies.forEach(s => {
		const value = getMorphedValue(s.replace('spread-', ''), script, props);
		const index = actions.findIndex(a => a === s);

		actions.splice(index, 1, ...value);
	});
};

export default spreadActions;
