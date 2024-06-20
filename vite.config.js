import { resolve } from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig, transformWithEsbuild  } from 'vite'
import * as packageJson from './package.json'
import libCss from 'vite-plugin-libcss';

import { promises as fs } from 'fs';
import path from 'path';
import glob from 'glob';

const customCopyPlugin = () => {
	return {
		name: 'custom-copy-plugin',
		writeBundle: async () => {
			const copyFiles = async (srcDir, distDir, globPattern) => {
				const filesToCopy = glob.sync(globPattern);

				await Promise.all(filesToCopy.map(async file => {
					const relativePath = path.relative(srcDir, file);
					const destPath = path.join(distDir, relativePath);

					await fs.mkdir(path.dirname(destPath), { recursive: true });

					await fs.copyFile(file, destPath.replace('/', '\\'));
				}));
			};

			await copyFiles('src/components', 'dist/components', 'src/components/**/system.json');
			await copyFiles('', 'dist', 'lspconfig.json');
		}
	};
}

export default defineConfig(() => ({
	plugins: [
		customCopyPlugin(),
		libCss(),
		{
			name: 'treat-js-files-as-jsx',
			async transform(code, id) {
				if (!id.match(/src\/.*\.js$/))
					return null;

				return transformWithEsbuild(code, id, {
					loader: 'jsx',
					jsx: 'automatic',
				});
			},
		},
		react(),
	],
	build: {
		lib: {
			entry: resolve('src', 'library.js'),
			name: '@intenda/opus-ui',
			formats: ['es'],
			fileName: () => `lib.js`,
		},
		rollupOptions: {
			external: [...Object.keys(packageJson.peerDependencies)],
		},
	},
	optimizeDeps: {
		esbuildOptions: {
			loader: {
				'.js': 'jsx',
			},
		},
	},
	test: {
		environment: 'jsdom'
	}
}));
