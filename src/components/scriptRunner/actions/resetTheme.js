import { getMdaHelper } from './getMda/getMda';

//Type: Default Declarations
//Name: themes
//Desc: array of objects for default themes
const themes = ['global', 'colors'];

//Type: Component Helpers
//Name: resetTheme
//Desc: reset app theme
//Args:
//	theme			array	 	Theme array
//	setWgtState		function 	set widget state
const resetTheme = async ({ theme = themes }, script, { setWgtState }) => {
	for (const name of theme) {
		const val = await getMdaHelper({
			type: 'theme',
			key: name
		});
		[val]
			.forEach(o => Object.entries(o).forEach(([key, value]) => {
				setWgtState(key, { value });
			}));
	}
};

export default resetTheme;
