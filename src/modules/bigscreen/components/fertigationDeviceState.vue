<!--水肥一体化设备状态-->
<template>
	<div
		class="w-full h-full bg-black bg-opacity-10 backdrop-filter backdrop-blur-6 text-white"
		ref="main"
	>
		<div class="flex flex-col">
			<div class="pl-4 flex items-center flex-1 resize_value_1">
				<el-icon><FullScreen class="text-green" /></el-icon>
				<span class="ml-2 text-white">水肥一体化设备状态</span>
			</div>
			<div class="flex ml-0.3vw mr-0.1vw h-0.2vh">
				<div class="w-1.5vw bg-white h-3px"></div>
				<div class="w-17.3vw bg-white mt-2px flex-1 h-1px"></div>
				<div class="w-0.6vw h-3px bg-[#8FFFA2]"></div>
			</div>
			<div>
				<vue3-seamless-scroll
					:list="obj"
					:step="0.3"
					limit-list="4"
					class="overflow-hidden resize_value_2"
				>
					<div
						v-for="(item, index) in obj"
						:key="index"
						class="pl-0.5vw"
					>
						<div class="flex justify-start resize_value_5">
							<div
								class="relative top-1.5vh h-2vh w-2vw pr-0.5vh"
							>
								<el-image :src="url" :fit="fit"></el-image>
							</div>
							<div class="flex flex-col justify-center">
								<div>
									<span class="text-white text-12px">{{
										item.name
									}}</span>
									<span
										class="bg-blue opacity-70 px-1vw text-white resize_value_3"
										>{{ item.realtimeDataValue }}</span
									>
								</div>
								<div>
									<span class="text-white resize_value_3"
										>设别类型：</span
									>
									<span class="text-green resize_value_3"
										>{{ item.type }} |</span
									>
									<span class="text-white resize_value_3">
										更新:{{ timerStr }}</span
									>
								</div>
							</div>
						</div>
					</div>
				</vue3-seamless-scroll>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="fertigation-device-state">
import { FullScreen } from "@element-plus/icons-vue";
import { ElImage } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import axios from "axios";
import dayjs from "dayjs";
import { useResizeObserver } from "@vueuse/core";
import deviceImg from "/$/bigscreen/static/device.png";
const main = ref(null);
let obj: any = reactive([]);
let timerStr = ref("");
const url = deviceImg;
const fit = "contain";

const font_size_value = ref("17.1px");
const line_height_value = ref("31.72px");
const height_value = ref("180px");
const font_size_value_3 = ref("3px");
const font_size_value_4 = ref("6px");
const height_value_1 = ref("60px");

useResizeObserver(main, entries => {
	const entry = entries[0];
	const { width, height } = entry.contentRect;

	if (width > 350) {
		height_value.value = 0.86 * height + "px";
	} else if (width > 306) {
		height_value.value = "180px";
	} else {
		height_value.value = 0.84 * height + "px";
	}
	font_size_value.value = 0.06 * width + "px";
	line_height_value.value = 0.15 * height + "px";
	height_value.value = 0.84 * height + "px";
	font_size_value_3.value = 0.01 * width + "px";
	font_size_value_4.value = 0.02 * width + "px";
	height_value_1.value = 0.3 * height + "px";
});

const getData = () => {
	var config = {
		method: "get",
		url: "/api/admin/device/nongtt/sensors",
	};

	axios(config).then(function (response) {
		if (response.status == 200) {
			for (let i = 0; i < response.data.data.length; i++) {
				obj.push(response.data.data[i]);
			}
			const timestamp = dayjs().valueOf(); // 获取当前时间的时间戳
			const format = "YYYY-MM-DD HH:mm:ss"; // 时间字符串的格式
			const timestampDevice = dayjs(
				response.data.data[0].realtimeTime,
				format
			).valueOf(); // 将指定的时间字符串解析为 Dayjs 对象，并转换为时间戳
			const str = dayjs(timestamp - timestampDevice).format("m");
			if (parseInt(str) == 0) {
				timerStr.value = "几秒钟前";
			} else {
				timerStr.value = str + "分钟前";
			}
		} else {
			throw new Error("获取水肥一体化设备信息失败");
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

.resize_value_2 {
	height: v-bind("height_value");
}

.resize_value_3 {
	font-size: v-bind("font_size_value_3");
}

.resize_value_4 {
	font-size: v-bind("font_size_value_4");
}

.resize_value_5 {
	height: v-bind("height_value_1");
}
</style>
