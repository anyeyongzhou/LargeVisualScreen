<!--未来一周湿度-->
<template>
	<div
		class="w-full h-full bg-black bg-opacity-10 backdrop-filter backdrop-blur-6 text-white"
		ref="main"
	>
		<div class="flex flex-col">
			<div class="pl-4 flex items-center flex-1 resize_value_1">
				<el-icon><FullScreen class="text-green" /></el-icon>
				<span class="ml-2 text-white">未来一周湿度</span>
			</div>
			<div class="flex ml-0.3vw mr-0.1vw h-0.2vh">
				<div class="w-1.5vw bg-white h-3px"></div>
				<div class="w-17.3vw bg-white mt-2px flex-1 h-1px"></div>
				<div class="w-0.6vw h-3px bg-[#8FFFA2]"></div>
			</div>
		</div>
		<div ref="demo" class="resize_value_2 pl-4"></div>
	</div>
</template>

<script setup lang="ts" name="humidity-of-the-coming-week">
import { FullScreen } from "@element-plus/icons-vue";
import { onMounted, onUnmounted, ref } from "vue";
import axios from "axios";
import * as echarts from "echarts";
import { useResizeObserver } from "@vueuse/core";
const main = ref(null);
const demo: any = ref(null);
var myChart: any = null;
var option: any = ref({});
const font_size_value = ref("17.1px");
const line_height_value = ref("31.72px");
const width_value_2 = ref("280px");

useResizeObserver(main, entries => {
	const entry = entries[0];
	const { width, height } = entry.contentRect;
	if (width < 306) {
		font_size_value.value = 0.06 * width + "px";
		line_height_value.value = 0.15 * height + "px";
		width_value_2.value = 0.93 * width + "px";
		if (myChart) {
			myChart.resize();
		}
	}
});

const getData = () => {
	var dateList: any = [];
	var dataList: any = [];
	var config = {
		method: "get",
		url: "/api/admin/device/ecois/rainfall",
	};

	axios(config).then(function (response) {
		if (response.status == 200) {
			var data = response.data.data;
			dateList = data.metedate;
			for (let i = 0; i < data.humidity.length; i++) {
				dataList[i] = data.humidity[i] * 100;
			}
			option = {
				title: {
					text: "湿度(%)",
					textStyle: {
						color: "white",
						fontSize: 10,
					},
					top: 30,
					left: 10,
				},
				xAxis: {
					type: "category",
					data: dateList,
					axisLabel: {
						color: "#fff", // 设置坐标轴标签的文字颜色为白色
						interval: 0, // 设置坐标轴刻度线的间隔为 0，表示不缩减刻度线
						fontSize: 8,
					},
				},
				yAxis: {
					type: "value",
					axisLabel: {
						color: "#fff", // 设置坐标轴标签的文字颜色为白色
						fontSize: 8,
					},
				},
				series: [
					{
						data: dataList,
						type: "line",
						smooth: true,
						lineStyle: {
							//颜色
							color: "green",
							//类别  dotted点线 solid实线  dashed虚线
							type: "solid",
						},
						itemStyle: {
							color: "green", // 设置点的颜色为红色
						},
					},
				],
			};
			myChart = echarts.init(demo.value);
			myChart.setOption(option);
		} else {
			throw new Error("获取未来一周湿度失败");
		}
	});
};

onMounted(() => {
	getData();
});
onUnmounted(() => {
	myChart.dispose();
});
</script>
<style lang="less" scoped>
.resize_value_1 {
	height: v-bind("line_height_value");
	line-height: v-bind("line_height_value");
	font-size: v-bind("font_size_value");
}

.resize_value_2 {
	width: v-bind("width_value_2");
	aspect-ratio: 10/8;
}
</style>
