//System
import { loadApp } from './library';

//App
loadApp({
	config: {
		env: 'development'
	},
	mdaPackage: {
		dashboard: {
			'index.json': {
			    startup: 'test',
			    themes: []
			},
			'test.json': {
				type: 'containerSimple',
				wgts: [{
					type: 'label',
					prps: {
						scps: [{
							actions: [{
								type: 'setState',
								key: 'caption',
								value: '{{eval.`window._.spliceWhere defined: ${!!_.spliceWhere}`}}'
							}]
						}]
					}
				}]
			}
		}
	},
	windowHelpers: {
		include: ['spliceWhere']
	}
});
