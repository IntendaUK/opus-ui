import { useMemo, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { getComponent } from '../managers/componentManager';

//System Helpers
import { emit } from '../managers/eventManager';
import { getInitialState, register, emitEvent, queueChanges, processQueue, destroyScope } from '../managers/flowManager/index';
import { generateGuid } from '../helpers';
import ChildWgt from './childWgt';
import { getFullPropSpec } from '../managers/componentManager';
import generateClassNames from './helpers/generateClassNames';
import generateAttributes from './helpers/generateAttributes';
import generateStyles from './helpers/generateStyles';
import { applyTraits } from '../managers/traitManager';
import { stateManager } from '../managers/stateManager';
import { getPropertyContainer } from '../managers/propertyManager';
import isConditionMet from '../managers/traitManager/isConditionMet';
import { lateBindTriggers } from '../../components/scriptRunner/helpers/lateBoundTriggers';
import registerScripts from './helpers/registerScripts';
import { fixScopeIds } from '../../components/scriptRunner/helpers/morphConfig';
import { addNodeToDom, removeNodeFromDom } from '../managers/scopeManager';
import { disposeScripts } from '../../components/scriptRunner/interface';
import { disposeLateBoundTriggers } from '../../components/scriptRunner/helpers/lateBoundTriggers';
import { removeStyleTag } from './helpers/styleTags.js';
import buildState from './helpers/buildState';

const onUnmount = mda =>{
	const { id } = mda;

	emitEvent(id, 'onUnmount', { full: { id } });

	stateManager.cleanupState(id);
	disposeLateBoundTriggers(id);
	disposeScripts(id);
	destroyScope(id);
	removeStyleTag(id);

	removeNodeFromDom(mda);
};

const onMount = (mda, setCpnProps, cpnProps, setCpnState, cpnState, setStyles, setClassNames, setHasMounted) => {
	let { id, type } = mda;

	if (!id) {
		id = generateGuid();
		mda.id = id;
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

	if (mda.condition) {
		const conditionMet = isConditionMet(mda.condition, mda.parentId);
		if (conditionMet === false)
			return;
	}

	if (mda.wgts) {
		mda.wgts.forEach(w => {
			if (!w.id)
				w.id = generateGuid();
		});
	}

	const fullPropSpec = getFullPropSpec(type);
	const cpnStateNew = buildState(fullPropSpec, mda);
	Object.assign(cpnState, cpnStateNew);

	stateManager.initState(id, setCpnState, cpnState);

	const addedNode = addNodeToDom(mda);
	if (!addedNode) {
		console.error('DUPLICATE ID FOUND FOR METADATA: ', mda);

		return;
	}

	stateManager.setComponentType(id, type)

	const attributes = generateAttributes(cpnState);

	const cpnPropsNew = getPropertyContainer(id);

	Object.assign(cpnPropsNew, {
		id,
		type,
		attributes,
		ChildWgt: ChildWgt.bind(null, id),
		setState: stateManager.setSelfState.bind(null, id),
		setWgtState: stateManager.setWgtState,
		getWgtState: stateManager.getWgtState,
		emit: emit.bind(null, id)
	});

	const getHandler = (fn, ...rest) => fn.bind(null, cpnPropsNew, ...rest);
	cpnPropsNew.getHandler = getHandler;

	queueChanges(id, cpnState, [], cpnState);
	register(cpnState.flows, id, cpnState);

	setCpnProps(cpnPropsNew);
	setCpnState(cpnStateNew);

	const styles = generateStyles(cpnState, fullPropSpec);
	setStyles(styles);

	const classNames = generateClassNames(cpnState, fullPropSpec);
	setClassNames(classNames);

	setHasMounted(true);

	return onUnmount.bind(null, mda);
};

const onMountDone = (hasMounted, id, setState, cpnState, fullPropSpec) => {
	if (!hasMounted)
		return;

	(async () => {
		await registerScripts(cpnState);
		lateBindTriggers(id);
		emitEvent(id, 'onMount', { full: cpnState });
	})();

	const flowState = getInitialState(id, {}, fullPropSpec);
	if (Object.keys(flowState).length)
		setState(flowState);
};

const onNewProps = (setState, oldState, mda, fullPropSpec) => {
	if (!fullPropSpec)
		return;

	const auth = mda.auth;
	if (!auth)
		return;

	const cpnStateNew = buildState(fullPropSpec, mda, true);

	const allAuth = auth[0] === '*';

	const delta = {};
	Object.entries(cpnStateNew).forEach(([key, newValue]) => {
		const oldValue = oldState[key];

		if (!allAuth) {
			const ignore = (
				(
					!auth.includes(key) ||
					newValue === undefined ||
					oldValue === newValue
				) ||
				(
					(
						typeof(oldValue) === 'object' ||
						typeof(newValue) === 'object'
					) &&
					JSON.stringify(oldValue) === JSON.stringify(newValue)
				)
			);

			if (ignore)
				return;
		}

		if (setState)
			delta[key] = newValue;
		else
			oldState[key] = newValue;
	});

	if (setState && Object.keys(delta).length)
		setState(delta);
};

const Wrapper = _props => {
	const { mda: { id, type, wgts, container, parentId } } = _props;

	const [cpnProps, setCpnProps] = useState({});
	const [cpnState, setCpnState] = useState({});
	const [styles, setStyles] = useState();
	const [classNames, setClassNames] = useState();
	const [hasMounted, setHasMounted] = useState(false);

	const Component = useMemo(() => getComponent(type), [type]);

	useEffect(onMount.bind(null, _props.mda, setCpnProps, cpnProps, setCpnState, cpnState, setStyles, setClassNames, setHasMounted), []);

	const fullPropSpec = useMemo(() => getFullPropSpec(cpnState.type), [cpnState.type]);

	useEffect(onMountDone.bind(null, hasMounted, id, cpnProps.setState, cpnState, fullPropSpec), [hasMounted]);

	useEffect(processQueue.bind(null, id), [cpnState.updates]);

	useEffect(onNewProps.bind(null, cpnProps.setState, cpnState, _props.mda, fullPropSpec), [_props.mda]);

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

	if (!cpnProps.id || !Component)
		return null;

	cpnProps.state = cpnState;
	cpnProps.wgts = wgts;

	const result = <Component key={cpnProps.id} {...cpnProps} {...styles} classNames={classNames} />;

	if (container) {
		let useId = container;
		if (useId.includes('||'))
			useId = fixScopeIds(useId, { ownerId: parentId });

		const elContainer = document.getElementById(useId);

		return ReactDOM.createPortal(result, elContainer);
	}

	return result;
};

export { Wrapper };
