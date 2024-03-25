//External Helpers
import { getPropertyContainer } from '../../managers/propertyManager';
import { runScriptSync } from '../../../components/scriptRunner/helpers/runScript';
import { getVariable } from '../../../components/scriptRunner/actions/variableActions';
import { getMorphedValue } from '../../../components/scriptRunner/helpers/morphConfig';
import getNextScriptId from '../../../components/scriptRunner/helpers/getNextScriptId';

//Helpers
const getPropScriptResult = (ownerId, props, context, script) => {
	if (ownerId)
		script.ownerId = ownerId;

	if (script.morphId === undefined)
		script.id = getNextScriptId();
	else
		script.id = script.morphId;

	const { id, morphVariable, morphActions } = script;

	const srProps = getPropertyContainer('SCRIPTRUNNER');

	runScriptSync(context, srProps, script, morphActions);

	const result = getVariable({
		id,
		name: morphVariable
	}, script, srProps);

	return result;
};

export const recurseProps = (ownerId, props, context, allowedToMorph, path = []) => {
	const srProps = getPropertyContainer('SCRIPTRUNNER');

	Object.entries(props).forEach(([k, v]) => {
		if (!v)
			return;

		let isMorphing = true;

		//allowedToMorph is an array that contain single propeties like 'cpt'
		// or subKeys like a.b.c.d
		// If we find a subKey we need to figure out if we have reached the deepest point
		// in which cast isMorphing will be true and we will morph the value an if not,
		// we need to drill deeper but not actually morph
		if (allowedToMorph !== undefined) {
			const match = allowedToMorph.some(a => {
				if (a === k)
					return true;

				if (a.includes('.') && a.includes([...path, k].join('.'))) {
					if (a !== path.join('.') + '.' + k)
						isMorphing = false;

					return true;
				}
			});

			if (!match)
				return;
		}

		if (v.morphVariable && isMorphing) {
			props[k] = getPropScriptResult(ownerId, props, context, v);

			return;
		}

		const type = typeof(v);

		if (type === 'object' || v instanceof Array) {
			//As soon as isMorphing is true we know we reached the deepest level of the
			// allowedToMorph property and we can keep drilling and morph everything
			// inside the property if it is an object
			recurseProps(ownerId, v, context, isMorphing ? undefined : allowedToMorph, [...path, k]);

			return;
		} else if (type !== 'string' || !isMorphing)
			return;

		props[k] = getMorphedValue(v, { ownerId }, srProps, true, k, props);
	});
};

//This function replaces strings of the form ((state.id.key)) with the correct values
// where 'id' is the id of the component and 'key' is the key you want to access.
const morphProps = (ownerId, props, context) => {
	const allowedToMorph = props.morphProps;

	if (!allowedToMorph)
		return;

	recurseProps(ownerId, props, context, allowedToMorph);
};

export default morphProps;
