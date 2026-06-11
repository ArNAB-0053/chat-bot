import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		proxy: {
			'/chat': {
				target: 'http://127.0.0.1:3001',
				changeOrigin: true,
			},
			'/conversations': {
				target: 'http://127.0.0.1:3001',
				changeOrigin: true,
			},
			'/health': {
				target: 'http://127.0.0.1:3001',
				changeOrigin: true,
			},
		},
	},
});
