import path from "path";
import { UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import compression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";
import { proxy } from "./src/cool/config/proxy";
import { cool } from "./build/cool";

// 引入Unocss
import Unocss from "unocss/vite";
import { presetUno, presetAttributify, presetIcons } from "unocss";

function resolve(dir: string) {
	return path.resolve(__dirname, ".", dir);
}

// https://vitejs.dev/config

export default (): UserConfig => {
	return {
		base: "/",
		plugins: [
			vue(),
			compression(),
			vueJsx(),
			cool(),
			visualizer({
				open: false,
				gzipSize: true,
				brotliSize: true,
			}),
			Unocss({
				// 使用Unocss
				presets: [presetUno(), presetAttributify(), presetIcons()],
			}),
		],
		css: {
			preprocessorOptions: {
				scss: {
					charset: false,
				},
			},
			postcss: {
				plugins: [
					require("postcss-px-to-viewport")({
						viewportWidth: 1600, // 视口的宽度，对应的是我们设计稿的宽度，一般是750
						unitPrecision: 3, // 指定 px 转换为视口单位值的小数位数
						viewportUnit: "vw", // 指定需要转换成的视口单位，建议使用 vw
						selectorBlackList: [".ignore", ".hairlines"], // 指定不转换为视口单位的类名，可以自定义
						minPixelValue: 1, // 小于等于1px的不转换
						mediaQuery: false, // 允许在媒体查询中转换 px
					}),
				],
			},
		},
		resolve: {
			alias: {
				"/@": resolve("src"),
				"/#": resolve("types"),
				"/$": resolve("src/modules"),
			},
		},
		server: {
			port: 9000,
			proxy,
			hmr: {
				overlay: true,
			},
		},
		build: {
			minify: "esbuild",
			// terserOptions: {
			// 	compress: {
			// 		drop_console: true,
			// 		drop_debugger: true
			// 	}
			// },
			sourcemap: false,
			rollupOptions: {
				output: {
					chunkFileNames: "static/js/[name]-[hash].js",
					entryFileNames: "static/js/[name]-[hash].js",
					assetFileNames: "static/[ext]/[name]-[hash].[ext]",
					manualChunks(id) {
						if (id.includes("node_modules")) {
							if (!["@cool-vue/crud"].find(e => id.includes(e))) {
								let str = id
									.toString()
									.split("node_modules/")[1];

								if (str[0] == "@") {
									str = str.replace("/", ".");
								}

								return str.split("/")[0].toString();
							}
						}
					},
				},
			},
		},
	};
};
