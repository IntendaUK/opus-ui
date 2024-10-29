//React
import React from 'react';

const wrapWidgets = ({ ChildWgt, wgts = [] }) => {
	const result = wgts.map((w, i) => {
		if (!w)
			debugger;
		if (!w.prps)
			w.prps = {};

		w.prps.indexInParent = i;

		return (
			<ChildWgt
				key={w.id}
				mda={w}
			/>
		);
	});

	return result;
};

export default wrapWidgets;
