import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: "prompt",
			includeAssets: ["favicon.ico", "apple-touch-icon.png", "maskable.png"],
			manifest: {
				name: "Messenger",
				short_name: "Messenger",
				description: "React Online Chat App",
				icons: [
					{
						src: "maskable.png",
						sizes: "196x196",
						type: "image/png",
						purpose: "any maskable",
					},
					{
						src: "logo192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "logo512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
				],
				theme_color: "#007CEB",
				background_color: "#007CEB",
				display: "standalone",
				scope: "/",
				start_url: "/",
				orientation: "portrait",
			},
		}),
	],
});
