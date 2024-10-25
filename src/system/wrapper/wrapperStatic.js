const WrapperStatic = ({ id, classNames, style, attributes, useWgts }) => {
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
