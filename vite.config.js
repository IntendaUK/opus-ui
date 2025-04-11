/* eslint-disable max-lines-per-function */

import { resolve } from 'node:path';
import { promises as fs } from 'fs';
import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig, transformWithEsbuild } from 'vite';
import * as packageJson from './package.json';
import libCss from 'vite-plugin-libcss';

// A helper function to recursively get all files in a directory.
const getAllFiles = async dir => {
	let files = [];
	const dirents = await fs.readdir(dir, { withFileTypes: true });
	for (const dirent of dirents) {
		const fullPath = path.join(dir, dirent.name);
		if (dirent.isDirectory())
			files = files.concat(await getAllFiles(fullPath));
		else
			files.push(fullPath);
	}

	return files;
};

const customCopyPlugin = () => {
	return {
		name: 'custom-copy-plugin',
		writeBundle: async () => {
			const copyFiles = async (srcDir, distDir, pattern) => {
				let filesToCopy = [];
				if (pattern.includes('*')) {
					//Assume the pattern means "copy all files under srcDir"
					filesToCopy = await getAllFiles(srcDir);
				} else {
					//Treat as a literal path (relative to srcDir if provided)
					filesToCopy = [srcDir ? path.join(srcDir, pattern) : pattern];
				}

				await Promise.all(
					filesToCopy.map(async filePath => {
						//Compute the relative path from the srcDir, if provided.
						const relativePath = srcDir
							? path.relative(srcDir, filePath)
							: path.basename(filePath);
						const destPath = path.join(distDir, relativePath);

						const stat = await fs.lstat(filePath);
						if (stat.isDirectory())
							await fs.mkdir(destPath, { recursive: true });
						else {
							await fs.mkdir(path.dirname(destPath), { recursive: true });
							await fs.copyFile(filePath, destPath);
						}
					})
				);
			};

			await copyFiles('src/components', 'dist/components', 'src/components/**/*');
			await copyFiles('src/props', 'dist/props', 'src/props/**/*');
			await copyFiles('src/system/helpers', 'dist/system/helpers', 'src/system/helpers/**/*');
			await copyFiles('', 'dist', 'lspconfig.json');
		}
	};
};

const ReactCompilerConfig = { target: '19' };

export default defineConfig(() => ({
	plugins: [
		customCopyPlugin(),
		libCss(),
		{
			name: 'treat-js-files-as-jsx',
			async transform (code, id) {
				if (!id.match(/src\/.*\.js$/)) return null;

				return transformWithEsbuild(code, id, {
					loader: 'jsx',
					jsx: 'automatic'
				});
			}
		},
		react({
			babel: {
				compact: true,
				plugins: [
					['babel-plugin-react-compiler', ReactCompilerConfig]
				]
			}
		})
	],
	resolve: {
		alias: {
			'@clone': path.resolve(__dirname, 'src/system/helpers/clone.js'),
			'@spliceWhere': path.resolve(__dirname, 'src/system/helpers/spliceWhere.js')
		}
	},
	build: {
		lib: {
			entry: resolve('src', 'library.jsx'),
			name: '@intenda/opus-ui',
			formats: ['es'],
			fileName: () => 'lib.js'
		},
		rollupOptions: {
			external: [
				'react',
				'react-dom',
				'react-dom/client',
				...Object.keys(packageJson.peerDependencies)
			],
			output: {
				globals: {
					react: 'React',
					'react-dom': 'ReactDOM',
					'react-dom/client': 'ReactDOMClient'
				}
			}
		}
	},
	optimizeDeps: { esbuildOptions: { loader: { '.js': 'jsx' } } }
}));
