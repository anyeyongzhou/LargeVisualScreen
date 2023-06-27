<template>
	<div class="relative w-100% h-100% overflow-hidden bg-black p-0 m-0">
		<div
			ref="main"
			class="xl:h-100vh xl:w-auto sm:h-auto sm:w-100% aspect-9/5 absolute top-50% left-50% transform -translate-x-1/2 -translate-y-1/2"
		>
			<!--地图所在的div块-->
			<div id="container" class="relative p-0 m-0 w-full h-full"></div>
			<!--顶部项目名称-->
			<div class="absolute top-0 w-full">
				<top-project-name></top-project-name>
			</div>
			<!--左侧边-->
			<div
				class="absolute bottom-0 left-0 flex flex-col justify-start resize_value"
			>
				<div class="w-full h-28%">
					<meteorological-monitoring></meteorological-monitoring>
				</div>
				<div class="w-full h-28%">
					<temperature-of-the-coming-week></temperature-of-the-coming-week>
				</div>
				<div class="w-full h-28%">
					<humidity-of-the-coming-week></humidity-of-the-coming-week>
				</div>
			</div>
			<!--底部-->
			<div class="resize_value_b">
				<div class="w-50%">
					<fertigation-device-state></fertigation-device-state>
				</div>
				<div class="w-50%">
					<farm-machinery-realtime-video></farm-machinery-realtime-video>
				</div>
			</div>
			<!--全屏显示控件-->
			<div class="fullscreen-control-in" ref="fullscreen"></div>
			<!--右侧边-->
			<div
				class="absolute bottom-0 right-0 flex flex-col justify-start resize_value"
			>
				<div class="w-full h-28%">
					<soil-monitoring
						:data="soilMonitoringData"
					></soil-monitoring>
				</div>
				<div class="w-full h-28%">
					<recent-soil-temperature
						:data="recentSTData"
					></recent-soil-temperature>
				</div>
				<div class="w-full h-28%">
					<recent-soil-moisture
						:data="recentSMData"
					></recent-soil-moisture>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="nky-big-screen">
import topProjectName from "/$/bigscreen/components/topProjectName.vue";
import farmMachineryRealtimeVideo from "/$/bigscreen/components/farmMachineryRealtimeVideo.vue";
import fertigationDeviceState from "/$/bigscreen/components/fertigationDeviceState.vue";
import humidityOfTheComingWeek from "/$/bigscreen/components/humidityOfTheComingWeek.vue";
import soilMonitoring from "/$/bigscreen/components/soilMonitoring.vue";
import meteorologicalMonitoring from "/$/bigscreen/components/meteorologicalMonitoring.vue";
import recentSoilMoisture from "/$/bigscreen/components/recentSoilMoisture.vue";
import recentSoilTemperature from "/$/bigscreen/components/recentSoilTemperature.vue";
import temperatureOfTheComingWeek from "/$/bigscreen/components/temperatureOfTheComingWeek.vue";
import tljGrey from "/$/bigscreen/static/tlj-grey.svg";
import tljRed from "/$/bigscreen/static/tlj-red.svg";

import AMapLoader from "@amap/amap-jsapi-loader";
import { onMounted, reactive, ref, watch } from "vue";
import { useResizeObserver } from "@vueuse/core";
import axios from "axios";
import dayjs from "dayjs";
let map: any = reactive({});
const main: any = ref(null);
const fullscreen: any = ref(null);
const inFullscreen = ref(false);
const index = ref(0);
const time = ref([9912602132, 9112599874]);
//左侧边和右侧板的样式随窗口变化而变化的样式
const resize_value_x: any = reactive({});
//底边的组件样式随窗口变化而变化的样式
const resize_value_b: any = reactive({});

const fullscreen_control_right_value = ref("");
useResizeObserver(main, entries => {
	const entry = entries[0];
	const { width, height } = entry.contentRect;
	//左侧边和右侧板的样式随窗口变化而变化的样式
	resize_value_x.h_value = height + "px";
	resize_value_x.top_value = 0.08 * height + "px";
	resize_value_x.gap_value = 0.03 * height + "px";
	resize_value_x.marginX_value = 0.02 * width + "px";
	resize_value_x.w_value = 0.225 * width + "px";
	//底边的组件样式随窗口变化而变化的样式
	resize_value_b.left_value = 0.265 * width + "px";
	resize_value_b.w_value = 0.47 * width + "px";
	resize_value_b.h_value = 0.28 * height + "px";
	resize_value_b.gap_value = 0.02 * width + "px";
	resize_value_b.bottom_value = 0.02 * height + "px";
	//全图控件位置
	fullscreen_control_right_value.value = 0.25 * width + "px";
});
//土壤检测后台数据
const soilMonitoringData: any = reactive({
	data: [null],
	index,
	showMessage: false,
});
//近期土壤温度数据
const recentSTData: any = reactive({
	dataList: [],
	dateList: [],
	index,
});
//近期土壤湿度数据
const recentSMData: any = reactive({
	dataList: [],
	dateList: [],
	index,
});
const nameEnList = [
	"AirTemperature",
	"EC",
	"Humidity",
	"Illuminance",
	"Moisture",
	"SoilTemperature",
];
const nameList = [
	"空气温度",
	"土壤电导率",
	"空气湿度",
	"光照强度",
	"土壤水分",
	"土壤温度",
];
const unitList = ["°C", "μS/cm", "Lux", "W/m2", "%", "°C"];

const tljImage = ref(tljGrey);
const positionArr = ref([120.41908, 30.440908]);
let marker: any = null;
let icon: any = null;

watch(positionArr, newVal => {
	// const lnglat = new AMap.LngLat(newVal[0] + 0.005, newVal[1] - 0.00225);
	// marker.setPosition(lnglat);
	var position = [newVal[0] + 0.005, newVal[1] - 0.00225];
	marker.setPosition(position);
});

watch(tljImage, newVal => {
	icon.setImage(newVal);
	marker.setIcon(icon);
});

const initMap = () => {
	window._AMapSecurityConfig = {
		securityJsCode: "ab50347180e98051a8caac09781b9f6e",
	};
	AMapLoader.load({
		// 申请好的Web端开发者Key
		key: "dcb3841ae0e471fed5651fea3aa69487",
		version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
		plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
	})
		.then(AMap => {
			// 初始化地图
			map = new AMap.Map("container", {
				//设置地图容器id
				zoom: 17.5, //设置地图显示的缩放级别
				center: [120.417754, 30.441805], //设置地图中心点坐标
				layers: [new AMap.TileLayer.Satellite()], //设置图层,可设置成包含一个或多个图层的数组
				mapStyle: "amap://styles/whitesmoke", //设置地图的显示样式
				viewMode: "2D", //设置地图模式，
				//pitch:45 //俯仰角度，默认 0，最大值根据地图当前 zoom 级别不断增大，2D地图下无效 。
			});

			// 创建 AMap.Icon 实例：
			icon = new AMap.Icon({
				size: new AMap.Size(40, 50), // 图标尺寸
				image: tljImage.value,
				imageOffset: new AMap.Pixel(0, 0), // 图像相对展示区域的偏移量，适于雪碧图等
				imageSize: new AMap.Size(20, 20), // 根据所设置的大小拉伸或压缩图片
			});

			// 将 Icon 实例添加到 marker 上:
			marker = new AMap.Marker({
				position: new AMap.LngLat(
					positionArr.value[0],
					positionArr.value[1]
				),
				offset: new AMap.Pixel(-10, -10),
				icon: icon,
				title: "拖拉机",
				zoom: 17.5,
			});

			map.add(marker);
		})
		.catch(e => {
			console.log(e);
		});
};

//添加全图控件
const getFullScreenController = () => {
	fullscreen.value.addEventListener("click", function () {
		if (document.fullscreenElement) {
			fullscreen.value.classList.remove("fullscreen-control-out");
			fullscreen.value.classList.add("fullscreen-control-in");
			document.exitFullscreen();
		} else {
			fullscreen.value.classList.remove("fullscreen-control-in");
			fullscreen.value.classList.add("fullscreen-control-out");
			main.value.requestFullscreen();
		}
	});
};

//获取接口/api/admin/device/echo/datapoints信息，传递给三个组件
const getData = async () => {
	var config = {
		method: "get",
		url: "/api/admin/device/echo/datapoints?sn=" + time.value[index.value],
	};
	if (!index.value) {
		index.value = 1;
	} else {
		index.value = 0;
	}

	var dateList: any = [];
	var dataList: any = [];
	var dataListSoil: any = [];

	await axios(config).then(function (response) {
		//服务器有返回
		if (response.status == 200) {
			//请求成功
			if (response.data.code == 1000) {
				//土壤近期温度
				var timeStamp = response.data.data.timeline;
				for (let i = 0; i < timeStamp.length; i++) {
					dateList[i] = dayjs(timeStamp[i] * 1000).format(
						"MM/DD HH:mm"
					);
				}
				dataList = response.data.data.sensors.SoilTemperature;
				recentSTData.dateList = dateList;
				recentSTData.dataList = dataList;
				recentSTData.index = index.value;

				//土壤近期水分
				dataListSoil = response.data.data.sensors.Moisture;
				recentSMData.dataList = dataListSoil;
				recentSMData.dateList = dateList;
				recentSMData.index = index.value;

				//土壤监测
				var data = response.data.data.latest;
				var temp = [];
				for (var i = 0; i < 6; i++) {
					temp[i] = {
						name: nameList[i],
						value: data[nameEnList[i]],
						unit: unitList[i],
					};
				}
				soilMonitoringData.data = temp;
				soilMonitoringData.index = index.value;
				soilMonitoringData.showMessage = true;
			}
		} else {
			throw new Error("获取土壤检测信息失败");
		}
	});
};

const getTljData = async () => {
	var config = {
		method: "post",
		url: "/api/admin/terminal/info/list",
	};

	await axios(config).then(function (response) {
		//服务器有返回
		if (response.status == 200) {
			//请求成功
			if (response.data.code == 1000) {
				positionArr.value = [
					response.data.data[0].longitude,
					response.data.data[0].latitude,
				];
				if (response.data.data[0].status == 0) {
					tljImage.value = tljRed;
				}
			} else {
				console.log("获取拖拉机位置失败");
			}
		} else {
			throw new Error("获取拖拉机失败");
		}
	});
};

onMounted(() => {
	initMap();
	getData();
	getFullScreenController();
	setInterval(() => {
		getData();
		getTljData();
	}, 10000);
});
</script>
<style scoped>
.resize_value {
	width: v-bind("resize_value_x.w_value");
	height: v-bind("resize_value_x.h_value");
	top: v-bind("resize_value_x.top_value");
	gap: v-bind("resize_value_x.gap_value");
	margin-left: v-bind("resize_value_x.marginX_value");
	margin-right: v-bind("resize_value_x.marginX_value");
}

.resize_value_b {
	position: absolute;
	bottom: v-bind("resize_value_b.bottom_value");
	display: flex;
	justify-content: flex-start;
	left: v-bind("resize_value_b.left_value");
	width: v-bind("resize_value_b.w_value");
	height: v-bind("resize_value_b.h_value");
	gap: v-bind("resize_value_b.gap_value");
}

.fullscreen-control-in {
	position: absolute;
	top: v-bind("resize_value_x.top_value");
	right: v-bind("fullscreen_control_right_value");
	width: 30px;
	height: 30px;
	background: url(../static/inFullScreen.svg) no-repeat center center;
	background-size: contain;
	cursor: pointer;
}
.fullscreen-control-out {
	position: absolute;
	top: v-bind("resize_value_x.top_value");
	right: v-bind("fullscreen_control_right_value");
	width: 30px;
	height: 30px;
	background: url(../static/outFullScreen.svg) no-repeat center center;
	background-size: contain;
	cursor: pointer;
}
</style>
