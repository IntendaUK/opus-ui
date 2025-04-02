const CustomComponent = ({ React, ExternalComponent, wrapChildren, forceRemount }) => {
	return ExternalComponent(props => {
		const { id, children, state } = props;
		const { genStyles, genClassNames, genAttributes } = state;

		const useWgts = React.useMemo(() => wrapChildren(props), []);

		return (
			<div
				id={id}
				className={genClassNames}
				style={genStyles?.style}
				{...genAttributes}
			>
				<span>[child elementz]</span>
				{useWgts}
			</div>
		);
	}, { forceRemount });
};

export default CustomComponent;
