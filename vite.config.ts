import { defineConfig } from 'vite'
import { nitro } from 'nitro/vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
	server: {
		port: 3000,
		host: '0.0.0.0',
		cors: {
			origin: 'https://static.cloudflareinsights.com',
			credentials: true,
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
			allowedHeaders: ['Content-Type'],
		},
	},
	plugins: [tailwindcss(), tanstackStart(), nitro(), viteReact()],
	resolve: { tsconfigPaths: true },
})
