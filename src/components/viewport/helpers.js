export const activateNextTab = (setWgtState, tabsMda, tabIndex) => {
	if (!tabsMda.length)
		return;

	let newActiveIndex = tabIndex;
	if (newActiveIndex >= tabsMda.length)
		newActiveIndex--;

	const tabId = tabsMda[newActiveIndex].id;

	setWgtState(tabId, { active: true });
};

export const activateTab = (tabsMda, setWgtState, tabIndex) => {
	tabsMda.forEach((m, i) => {
		setWgtState(m.id, { active: i === tabIndex });
	});
};

