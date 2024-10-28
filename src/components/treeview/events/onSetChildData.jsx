/* eslint-disable max-lines-per-function */

//Helpers
import recurseFindNode from '../helpers/recurseFindNode';

//Event
const onSetChildData = props => {
	const { setState, state, state: { } } = props;
	const { tSetChildData, childAtr, data, patAtr, dtaAtr } = state;

	if (!tSetChildData)
		return;

	const newState = {
		data,
		deleteKeys: ['tSetChildData']
	};

	tSetChildData.forEach(t => {
		const node = recurseFindNode(props, data, d => {
			return d[dtaAtr] === t[patAtr];
		});

		const childKey = `childData-${t[patAtr]}`;

		const children = state[childKey] ?? newState[childKey] ?? [];

		newState[childKey] = children;

		children.spliceWhere(f => f[dtaAtr] === t[dtaAtr]);
		children.push(t);

		const childChildren = state[`childData-${t[dtaAtr]}`];
		if (childChildren)
			t[childAtr] = childChildren;
		else if (t[childAtr])
			newState[`childData-${t[dtaAtr]}`] = [];

		for (let i = 0; i < children.length; i++) {
			const o = children[i];

			const remove = !tSetChildData.some(f => f[patAtr] === o[patAtr] && f[dtaAtr] === o[dtaAtr]);

			if (remove) {
				children.splice(i, 1);
				i--;
			}
		}

		//If we drop a granchild inside a grandparent, we'll delete an intermediary parent
		// which means that childNodes for said parent will get disconnected so we set
		// them back here
		children.forEach(c => {
			const grandchildren = state[`childData-${c[dtaAtr]}`];
			if (grandchildren)
				c[childAtr] = grandchildren;
		});

		if (node)
			node[childAtr] = children;
	});

	setState(newState);
};

export default onSetChildData;
