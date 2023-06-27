export const proxy = {
	"/dev/": {
		target: "http://127.0.0.1:8001",
		changeOrigin: true,
		rewrite: (path: string) => path.replace(/^\/dev/, ""),
	},

	"/prod/": {
		target: "https://show.cool-admin.com",
		changeOrigin: true,
		rewrite: (path: string) => path.replace(/^\/prod/, "/api"),
	},
	// 将以 /api 开头的请求代理到目标地址
	"/api": {
		target: "https://udsp.cpsmart.cn", // 目标地址
		changeOrigin: true, // 开启跨域
		rewrite: (path: string) => path.replace(/^\/api/, "/api"),
	},
};
