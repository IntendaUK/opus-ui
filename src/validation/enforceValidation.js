import { enforcers } from './validators';

const enforceValidation = (props, errors) => {
	const { state: { value: wgtValue } } = props;
	let value = wgtValue;

	errors
		.forEach(({ validatorKey }) => {
			const enforcer = enforcers[validatorKey];

			if (enforcer)
				value = enforcer(props.state, value);
		});

	if (value !== props.value)
		props.setState({ value });
};

export default enforceValidation;
