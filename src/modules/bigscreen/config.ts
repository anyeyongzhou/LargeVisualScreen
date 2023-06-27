import { ModuleConfig } from "/@/cool";

export default (): ModuleConfig => {
	return {
		views: [
			{
				path: "/views/screen",
				meta: {
					label: "可视化大屏",
					keepAlive: true,
				},
				component: () => import("./views/home/index.vue"),
			},
		],
		pages: [
			{
				path: "/data/screen",
				meta: {
					label: "农科院可视化大屏",
					keepAlive: true,
				},
				component: () => import("./pages/nkyBigScreen.vue"),
			},
		],
	};
};
