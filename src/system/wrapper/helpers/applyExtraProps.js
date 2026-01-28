//Helpers
const formatDate = () => {
	const date = new Date();

	const dateConfig = {
		weekday: 'long',
		month: 'long',
		day: 'numeric'
	};
	const formattedDate = date.toLocaleString('en-us', dateConfig).toUpperCase();

	return formattedDate;
};

const applyExtraProps = props => {
        const { cpt } = props;

        if (
                !cpt ||
                !cpt.substr ||
        cpt.substr(0, 1) !== '{' ||
        cpt.substr(-1, 1) !== '}' ||
        !cpt.includes('{extra.')
        )
                return;

        const useFormat = cpt.split('{extra.')[1].replace('}', '');

        const formatters = { currentDate: formatDate };
        const formatterFn = formatters[useFormat];

        if (typeof formatterFn === 'function')
                props.cpt = formatterFn(props);
};

export default applyExtraProps;
