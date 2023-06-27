<!--农机实时视频-->
<template>
	<div
		class="w-full h-full bg-black bg-opacity-10 backdrop-filter backdrop-blur-6 text-white"
		ref="main"
	>
		<div class="flex flex-col">
			<div class="pl-4 flex items-center flex-1 resize_value_1">
				<el-icon><FullScreen class="text-green" /></el-icon>
				<span class="ml-2 text-white">农机实时视频</span>
			</div>
			<div class="flex ml-0.3vw mr-0.1vw h-0.2vh">
				<div class="w-1.5vw bg-white h-3px"></div>
				<div class="w-17.3vw bg-white mt-2px flex-1 h-1px"></div>
				<div class="w-0.6vw h-3px bg-[#8FFFA2]"></div>
			</div>
		</div>
		<div v-if="showVideo">111</div>
		<div class="flex items-center justify-center h-full w-full" v-else>
			<div class="flex flex-col items-center">
				<el-icon :size="30"><VideoPlay></VideoPlay></el-icon>
				<div class="text-sm text-gray-300 mt-3 text-8">
					设备离线，点击重试
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="farm-machinery-realtime-video">
import { FullScreen, VideoPlay } from "@element-plus/icons-vue";
import { onMounted, ref } from "vue";
import axios from "axios";
import { useResizeObserver } from "@vueuse/core";

const main = ref(null);
let obj: any = ref([]);
const showVideo: any = ref(false);

const font_size_value = ref("17.1px");
const line_height_value = ref("31.72px");

useResizeObserver(main, entries => {
	const entry = entries[0];
	const { width, height } = entry.contentRect;
	if (width < 306) {
		font_size_value.value = 0.06 * width + "px";
		line_height_value.value = 0.15 * height + "px";
	}
});

const getData = () => {
	var config = {
		method: "get",
		url: "/api/admin/monitor/device/address?deviceSerial=K88522458",
	};

	axios(config).then(function (response) {
		if (response.status == 200) {
			if (response.data.code == 1000) {
				console.log(response.data);
				showVideo.value = true;
			} else {
				showVideo.value = false;
			}
			obj = response.data.data;
			showVideo.value = false;
		} else {
			throw new Error("获取气象检测信息失败");
		}
	});
};

onMounted(() => {
	getData();
});
</script>
<style lang="less" scoped>
.resize_value_1 {
	height: v-bind("line_height_value");
	line-height: v-bind("line_height_value");
	font-size: v-bind("font_size_value");
}
</style>
