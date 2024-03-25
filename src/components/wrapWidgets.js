//React
import React from 'react';

const wrapWidgets = ({ ChildWgt, wgts = [] }) => {
	const result = wgts.map(w => <ChildWgt key={w.id} mda={w} />);

	return result;
};

export default wrapWidgets;
