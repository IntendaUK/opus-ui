//React
import { useEffect } from 'react';

import { removeNodeFromDom } from '../managers/scopeManager';

const WrapperStatic = ({ id, classNames, style, attributes, useWgts }) => {
	useEffect(() => { return () => { console.log(id); removeNodeFromDom({ id }) } }, []);

	return (
		<div
			id={id}
			className={classNames}
			style={style}
			{...attributes}
		>
			{useWgts}
		</div>
	);
};

export default WrapperStatic;
