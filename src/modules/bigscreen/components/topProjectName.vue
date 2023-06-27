<!--顶部项目名称-->
<template>
	<div class="absolute top-0 w-full" ref="main">
		<el-image
			:src="url"
			fit="fill"
			class="w-100.3% p-0 relative -left-2px"
		></el-image>
		<div
			class="absolute top-0 flex flex-nowrap w-full text-white resize_value"
		>
			<!--左边地点，天气信息-->
			<div class="flex-1 flex">
				<div class="ml-8 font-medium font_tengxiang">
					{{ city }}
				</div>
				<div class="ml-3 font_youshe">
					{{ temperature }}
				</div>
				<div class="flex items-center ml-3">
					<div class="font-medium font_tengxiang">{{ weather }}</div>
				</div>
			</div>
			<!--中间项目名称-->
			<div class="flex-1 text-white mt-1 text-center font_youshe">
				{{ projectName }}
			</div>
			<!--右边时间信息-->
			<div class="flex-1 flex justify-end">
				<span
					class="text-white whitespace-nowrap pr-32px font-medium font_tengxiang"
					>{{ nowTime }}</span
				>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="top-project-name">
import { onMounted, onUnmounted, ref } from "vue";
import axios from "axios";
import pictureUrl from "/$/bigscreen/static/screen-title.png";
import dayjs from "dayjs";
import { useResizeObserver } from "@vueuse/core";
const main = ref(null);
const url = pictureUrl;
const city = ref("");
const temperature = ref("");
const weather = ref("");
const projectName = ref("");
const nowTime = ref("");
let timer: any = null;
const font_size_value = ref("12.79px");
const font_size_value_1 = ref("25.58px");
const line_height_value = ref("38.22px");

useResizeObserver(main, entries => {
	const entry = entries[0];
	const { width, height } = entry.contentRect;
	if (width < 1360) {
		font_size_value.value = 0.01 * width + "px";
		font_size_value_1.value = 0.02 * width + "px";
		line_height_value.value = 0.03 * width + "px";
	}
});

//获取地点，天气信息
const getLoacationData = () => {
	var config = {
		method: "get",
		url: "/api/admin/weather/info/info",
	};

	axios(config).then(function (response) {
		//console.log(response);
		if (response.status == 200) {
			const data = response.data.data;
			city.value = data.city;
			temperature.value = data.temperature + "°C";
			weather.value = data.weather;
		} else {
			throw new Error("获取地点，天气信息失败");
		}
	});
};

//获取项目名称
const getProjectName = () => {
	projectName.value = "长三角特色优势蔬菜智慧农场";
};

//获取时间信息
const getDateMessage = () => {
	var date = dayjs().format("YYYY年M月D日 HH:mm:ss");
	nowTime.value = date;
};
onMounted(() => {
	getLoacationData();
	getProjectName();
	timer = setInterval(getDateMessage, 1000);
});

// 在组件卸载时停止定时器
onUnmounted(() => {
	clearInterval(timer);
});
</script>
<style lang="less" scoped>
.font_tengxiang {
	font-family: TengXiangJiaLiXiYuanJian, sans-serif;
	font-size: v-bind("font_size_value");
}
.font_youshe {
	font-family: YouSheBiaoTiHei, sans-serif;
	font-size: v-bind("font_size_value_1");
}

.resize_value {
	height: v-bind("line_height_value");
	line-height: v-bind("line_height_value");
}
</style>
