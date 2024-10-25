import { useMemo, useState, useEffect } from 'react';

import { getComponent } from '../managers/componentManager';

//System Helpers
import { generateGuid } from '../helpers';
import ChildWgt from './childWgt';
import { getFullPropSpec } from '../managers/componentManager';
import applyPropSpec from './helpers/applyPropSpec';
import generateClassNames from './helpers/generateClassNames';
import generateAttributes from './helpers/generateAttributes';
import generateStyles from './helpers/generateStyles';
import { applyTraits } from '../managers/traitManager';
import { stateManager } from '../managers/stateManager';
import { getPropertyContainer } from '../managers/propertyManager';

const onMount = (mda, setCpnProps, cpnProps, setCpnState, cpnState) => {
	let { id, wgts, type } = mda;

	if (!id)
		id = generateGuid();

	if (wgts) {
		wgts.forEach(w => {
			if (!w.id)
				w.id = generateGuid();
		});
	}

	if (mda.trait) {
		if (!mda.traits)
			mda.traits = [];

		mda.traits.push({
			trait: mda.trait,
			traitPrps: mda.traitPrps
		});

		delete mda.trait;
		delete mda.traitPrps;
	}

	while (mda.traits) {
		applyTraits(mda, {});

		type = mda.type;
	}

	const propSpec = getFullPropSpec(type);

	const cpnStateNew = applyPropSpec(mda, propSpec);
	cpnStateNew.id = id;
	cpnStateNew.type = type
	cpnStateNew.updates = cpnState.updates;
	cpnStateNew._genStyles = true;
	cpnStateNew._genClassNames = true;

	stateManager.initState(id, setCpnState, cpnState);
	stateManager.setComponentType(id, type)

	const attributes = generateAttributes(cpnStateNew);

	const cpnPropsNew = getPropertyContainer(id);

	Object.assign(cpnPropsNew, {
		id,
		type,
		attributes,
		ChildWgt: ChildWgt.bind(null, id),
		setState: stateManager.setSelfState.bind(null, id),
		setWgtState: stateManager.setWgtState,
		wgts
	});

	const getHandler = (fn, ...rest) => fn.bind(null, cpnPropsNew, ...rest);
	cpnPropsNew.getHandler = getHandler;

	setCpnProps(cpnPropsNew);
	setCpnState(cpnStateNew);
};


const Wrapper = _props => {
	const { mda: { type } } = _props;

	const [cpnProps, setCpnProps] = useState({});
	const [cpnState, setCpnState] = useState({ updates: 0 });
	const [styles, setStyles] = useState();
	const [classNames, setClassNames] = useState();

	const Component = useMemo(() => getComponent(type), [type]);

	useEffect(onMount.bind(null, _props.mda, setCpnProps, cpnProps, setCpnState, cpnState), []);

	const fullPropSpec = useMemo(() => getFullPropSpec(cpnState.type), [cpnState.type]);

	useEffect(() => {
		if (!cpnState._genStyles)
			return;

		const styles = generateStyles(cpnState, fullPropSpec);

		setStyles(styles);

		cpnProps.setState({
			_genStyles: false
		});
	}, [cpnState._genStyles]);

	useEffect(() => {
		if (!cpnState._genClassNames)
			return;

		const classNames = generateClassNames(cpnState, fullPropSpec);

		setClassNames(classNames);

		cpnProps.setState({
			_genClassNames: false
		});
	}, [cpnState._genClassNames]);

	if (!cpnProps.id)
		return null;

	cpnProps.state = cpnState;

	return <Component key={cpnProps.id} {...cpnProps} {...styles} classNames={classNames} />;
};

export { Wrapper };
