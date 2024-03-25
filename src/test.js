import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Opus, { Component, loadApp, registerComponentTypes } from './library';

import Input from './testComponents/input';
import prpsInput from './testComponents/input/props';

(async () => {
	const res = await fetch('http://localhost:5000/packaged/mdaPackage.json');
	const mdaPackage = await res.json();

	registerComponentTypes([{
		type: 'input',
		component: Input,
		propSpec: prpsInput
	}]);

	loadApp({
		mdaPackage,
		config: { env: 'development' },
		startupDashboardPath: 'tests/flows'
	});
})();
