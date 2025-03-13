//React
import React from 'react';

//System
import { Wrapper } from './wrapper';

//Component
const ChildWgt = (parentId, props) => {
	const { mda, parentAndPathSet } = props;

	//Some components (like viewport) will set the parent and path manually
	if (mda && !parentAndPathSet)
		mda.parentId = parentId;

	return <Wrapper key={mda.id} {...props} />;
};

export default ChildWgt;
