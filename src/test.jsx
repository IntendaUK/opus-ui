//Opus
import { loadApp, registerComponentTypes } from './library';

const Input = ({ id, style, getHandler, state: { value, placeholder } }) => {
	const onInput = getHandler((props, e) => {
		const { setState, state: { value: oldValue } } = props;
		const { target } = e;

		let value = target.value;

		if (value !== oldValue)
			setState({ value });
	});

	return (
		<input
			key={id}
			id={id}
			style={style}
			value={value}
			placeholder={placeholder}
			onInput={onInput}
		/>
	);
};

const propsInput = {
	value: {
		type: 'string',
		dft: ''
	},
	placeholder: {
		type: 'string'
	}
};

registerComponentTypes([{
	type: 'input',
	component: Input,
	propSpec: propsInput
}]);

// Main
(async() => {
	const env = import.meta.env.VITE_APP_MODE;

	const res = await fetch('/app.json');
	const mdaPackage = await res.json();

	loadApp({
		mdaPackage,
		loadUrlParameters: true,
		config: {
			env,
			...window.opusConfig
		}
	});
})();