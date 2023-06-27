import { createApp } from "vue";
import App from "./App.vue";
import { bootstrap } from "./cool";
//导入阿里矢量库图标
import "../public/fonts/iconfont.css";
// 导入Unocss
import "uno.css";

//导入无缝滚动插件
import vue3SeamlessScroll from "vue3-seamless-scroll";

//导入样式style.css
import "../public/css/style.css";

const app = createApp(App);

app.use(vue3SeamlessScroll);

// 启动
bootstrap(app)
	.then(() => {
		app.mount("#app");
	})
	.catch(err => {
		console.error("COOL-ADMIN 启动失败", err);
	});
