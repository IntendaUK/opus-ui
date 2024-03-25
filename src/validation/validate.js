import notifyWidget from './notifyWidget';
import enforceValidation from './enforceValidation';

import { validators } from './validators';

const validate = props => {
	const { id, setState, state } = props;

	if (!id)
		return;

	const errors = [];

	const { value, cpt = 'No Label', error: currentErrorState, enforceValidators } = state;

	validators.forEach(([validatorKey, validator]) => {
		const error = validator(value, cpt, state);
		if (error) {
			errors.push({
				validatorKey,
				error
			});
		}
	});

	if (!errors.length) {
		if (currentErrorState) {
			setState({
				hasError: false,
				deleteKeys: ['error']
			});
		}

		return;
	}

	if (enforceValidators)
		enforceValidation(props, errors);
	else
		notifyWidget(props, errors);
};

export default validate;
