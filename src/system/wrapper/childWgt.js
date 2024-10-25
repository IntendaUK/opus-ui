//System
import { Wrapper } from './wrapper';

//Helpers
import { generateGuid } from '../helpers';

//Component
const ChildWgt = (parentId, props) => {
	const { mda } = props;

	if (mda)
		mda.parentId = parentId;

	return <Wrapper key={mda.id} {...props} />;
};

export default ChildWgt;
