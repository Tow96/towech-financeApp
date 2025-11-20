import { defineConfig } from 'vite'
import { nitro } from 'nitro/vite'
import tsConfigPaths from 'vite-tsconfig-paths'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
	server: { port: 3000, host: '0.0.0.0' },
	plugins: [
		tsConfigPaths({
			projects: ['./tsconfig.json'],
		}),
		tailwindcss(),
		tanstackStart(),
		nitro(),
		viteReact(),
	],
})
