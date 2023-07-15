<template>
	<div
		class="relative w-100% h-100% overflow-hidden bg-black p-0 m-0"
		ref="main"
	>
		<div
			ref="main"
			class="w-100% h-100% absolute top-50% left-50% transform -translate-x-1/2 -translate-y-1/2"
		>
			<!--地图所在的div块-->
			<div id="container" class="relative p-0 m-0 w-full h-full"></div>
			<!--搜索框组件-->
			<div class="absolute top-3 left-3 w-345px h-32px">
				<el-autocomplete
					v-model="state"
					:fetch-suggestions="querySearchAsync"
					placeholder="搜索地块、农机"
					@select="handleSelect"
					clearable
					class="w-300px inline-block"
				>
					<template #suffix> </template>
				</el-autocomplete>
				<div class="inline-block w-45px text-white">
					<el-button
						color="#60BA6F"
						type="primary"
						@click="handleButtonClick"
					>
						<el-icon class="text-white"><Search></Search></el-icon>
					</el-button>
				</div>
			</div>
			<!--全屏显示控件-->
			<div
				class="absolute bottom-90px left-15px bg-white h-30px w-30px rounded-5px text-center"
			>
				<div class="fullscreen-control-in" ref="fullscreen"></div>
			</div>
			<!--比例尺放大缩小控件-->
			<!--右侧组件  -->
			<el-scrollbar class="absolute top-3 right-3 w-310px">
				<!--右侧组件4个-->
				<div class="w-full mb-2 p-0 text-0 leading-0">
					<el-checkbox-group
						v-model="checkedComponent"
						fill="white"
						text-color="green"
						@change="handleChange"
					>
						<el-checkbox-button
							class="w-1/4"
							:label="rightComponent[0]"
						>
							<span
								><el-icon
									class="relative top-0.8 right-0.4 w-1.1rem h-1rem -mt-0.5rem fill-current overflow-hidden"
									><PieChart /></el-icon
								>{{ rightComponent[0] }}</span
							>
						</el-checkbox-button>
						<el-checkbox-button
							class="w-1/4"
							:label="rightComponent[1]"
						>
							<span
								><el-icon
									class="relative top-0.8 right-0.4 w-1.1rem h-1rem -mt-0.5rem fill-current overflow-hidden"
									><ChatDotSquare /></el-icon
								>{{ rightComponent[1] }}</span
							>
						</el-checkbox-button>
						<el-checkbox-button
							class="w-1/4"
							:label="rightComponent[2]"
						>
							<span
								><el-icon
									class="relative top-0.8 right-0.4 w-1.1rem h-1rem -mt-0.5rem fill-current overflow-hidden"
									><CopyDocument /></el-icon
								>{{ rightComponent[2] }}</span
							>
						</el-checkbox-button>
						<el-checkbox-button
							class="w-1/4"
							:label="rightComponent[3]"
						>
							<span
								><el-icon
									class="relative top-0.8 right-0.4 w-1.1rem h-1rem -mt-0.5rem fill-current overflow-hidden"
									><EditPen /></el-icon
								>{{ rightComponent[3] }}</span
							>
						</el-checkbox-button>
					</el-checkbox-group>
				</div>
				<!--实时统计组件-->
				<div
					class="relative bg-white rounded opacity-90 p-4 mb-2"
					ref="component1Ref"
				>
					<div class="flex flex-col">
						<div class="flex items-center">
							<div class="flex items-center">
								<div class="text-lg font-medium flex-1">
									实时统计
								</div>
								<div ref="componentIcon1Ref">
									<el-icon
										class="absolute top-5 right-4 cursor-pointer"
										><CircleClose
									/></el-icon>
								</div>
							</div>
						</div>
						<div class="flex mt-4">
							<div class="flex flex-col flex-1">
								<div class="flex items-center">
									<div
										class="w-2 h-2 rounded mr-2 bg-green"
									></div>
									<div class="text-xs color-#82818C">
										在线农机
									</div>
								</div>
								<div class="flex items-center ml-4">
									<div
										class="text-xl font-medium color-#1C1A27"
									>
										{{ sstjDataList.onlineCount }}
									</div>
									<div class="text-xs color-#82818C ml-1">
										台
									</div>
								</div>
							</div>
							<div class="flex flex-col flex-1">
								<div class="flex items-center">
									<div
										class="w-2 h-2 rounded mr-2 bg-gray"
									></div>
									<div class="text-xs color-#82818C">
										离线农机
									</div>
								</div>
								<div class="flex items-center ml-4">
									<div
										class="text-xl font-medium color-#1C1A27"
									>
										{{ sstjDataList.offlineCount }}
									</div>
									<div class="text-xs color-#82818C ml-1">
										台
									</div>
								</div>
							</div>
							<div class="flex flex-col">
								<div class="flex items-center">
									<div
										class="w-2 h-2 rounded mr-2 bg-yellow"
									></div>
									<div class="text-xs color-#82818C">
										地块数量
									</div>
								</div>
								<div class="flex items-center ml-4">
									<div
										class="text-xl font-medium color-#1C1A27"
									>
										{{ sstjDataList.fieldCount }}
									</div>
									<div class="text-xs color-#82818C ml-1">
										块
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!--实时动态组件-->
				<div
					class="relative bg-white rounded opacity-90 p-4 mb-2"
					ref="component2Ref"
				>
					<div class="flex flex-col">
						<div class="flex items-center">
							<div class="flex items-center">
								<div class="text-lg font-medium flex-1">
									实时动态
								</div>
								<div ref="componentIcon2Ref">
									<el-icon
										class="absolute top-5 right-4 cursor-pointer"
										><CircleClose
									/></el-icon>
								</div>
							</div>
						</div>
						<div
							class="flex items-center h-[120px] w-full justify-center"
						>
							<el-empty
								description="暂无实时动态"
								:image-size="60"
							>
							</el-empty>
						</div>
						<div class="flex items-center justify-between">
							<div>
								<span class="text-xs text-gray-600">全部</span
								><el-icon class="relative top-1"
									><ArrowDown
								/></el-icon>
							</div>
							<div>
								<el-icon class="relative top-1"
									><Clock
								/></el-icon>
							</div>
						</div>
					</div>
				</div>
				<!--图层管理组件-->
				<div
					class="relative bg-white rounded opacity-90 p-4 mb-2"
					ref="component3Ref"
				>
					<div class="flex flex-col">
						<div class="flex items-center">
							<div class="flex items-center">
								<div class="text-lg font-medium flex-1">
									图层管理
								</div>
								<div ref="componentIcon3Ref">
									<el-icon
										class="absolute top-5 right-4 cursor-pointer"
										><CircleClose
									/></el-icon>
								</div>
							</div>
						</div>
					</div>
					<div class="mt-2">
						<div class="text-xs color-[#666571]">地块管理</div>
						<el-checkbox-group
							v-model="checkList"
							@change="changeCheckbox"
						>
							<el-checkbox label="1" class="block top-2"
								><span>{{ checkListName[0] }}</span
								><span class="font-light color-[#666571]">
									（{{ checkListSerialNum[0] }}）
								</span></el-checkbox
							>
							<el-checkbox label="2" class="block top-2"
								><span>{{ checkListName[1] }}</span
								><span class="font-light color-[#666571]">
									（{{ checkListSerialNum[1] }}）
								</span></el-checkbox
							>
						</el-checkbox-group>
					</div>
					<div class="mt-2">
						<div class="text-xs color-[#666571]">农机管理</div>
						<el-checkbox-group
							v-model="checkList2"
							@change="changeCheckbox2"
						>
							<el-checkbox label="1" class="block top-2"
								><span>{{ checkList2Name[0] }}</span
								><span class="font-light color-[#666571]">
									（{{ checkList2SerialNum[0] }}）
								</span></el-checkbox
							>
						</el-checkbox-group>
					</div>
				</div>
			</el-scrollbar>
			<!--农机弹窗-->
			<div ref="njInfoWindowRef">
				<div class="flex flex-col items-center">
					<div class="w-[280px] rounded-sm bg-gray-100 p-4">
						<div class="flex flex-col mb-3">
							<div class="flex items-center">
								<div class="flex-1">
									<span class="font-medium">{{
										tljData.name
									}}</span
									><span class="text-[#666571] m-1"
										>({{ tljData.serialNum }})</span
									>
								</div>
								<div class="flex items-center">
									<div
										class="w-[6px] h-[6px] rounded bg-[#82818C]"
									></div>
									<span class="text-xs ml-1 text-[#82818C]">{{
										tljData.type == 0 ? "未开机" : "开机"
									}}</span>
								</div>
							</div>
							<div class="flex text-xs mt-1">
								<div class="text-[#1C1A27] flex-1">
									浙江省农业科学院杨渡科研创新基地
								</div>
								<div class="text-[#666571]">16:21</div>
							</div>
						</div>
						<div class="bg-white p-3 rounded">
							<div class="text-base">基础信息</div>
							<div class="flex mt-1">
								<div class="flex-1">
									<div class="text-gray-500 text-sm">
										农机型号：
									</div>
									<div
										class="mt-0.5 text-base text-[#1C1A27]"
									>
										{{ tljData.name }}
									</div>
								</div>
								<div class="flex-1">
									<div class="text-gray-500 text-sm">
										农机尺寸：
									</div>
									<div
										class="mt-0.5 text-base text-[#1C1A27]"
									>
										{{ tljData.size }}
									</div>
								</div>
							</div>
						</div>
						<div
							class="flex items-center bg-white pl-3 pr-2 py-2 rounded active:bg-gray-200 cursor-pointer mt-3"
							@click="showHistoryDialog"
						>
							<div class="svg-icon"></div>
							<div class="ml-2 flex-1 text-gray-800 text-sm">
								历史轨迹
							</div>
						</div>
					</div>
					<div class="w-4.4 overflow-hidden inline-block">
						<div
							class="h-3 w-3 bg-gray-100 -rotate-45 transform origin-top-left"
						></div>
					</div>
				</div>
			</div>
		</div>
		<!--农机历史轨迹弹窗-->
		<div>
			<el-dialog
				v-model="dialogVisible"
				:show-close="true"
				id="historyDialogRef"
			>
				<template #header="{ close, titleId }">
					<div
						class="relative pt-0 pb-2 text-center border-b-1 border-t-0 border-l-0 border-r-0 border-gray-200 border-solid mr-0 select-none"
					>
						<h4 :id="titleId">历史轨迹</h4>
						<div v-if="!dialogFullScreen">
							<el-icon
								class="absolute top-0 right-3 cursor-pointer"
								@click="historyFullScreenClick"
								><FullScreen
							/></el-icon>
						</div>
						<div v-else>
							<el-icon
								class="absolute top-0 right-3 cursor-pointer"
								@click="historyFullScreenClick"
								><Minus
							/></el-icon>
						</div>
					</div>
				</template>
				<div
					id="historyTaceContainer"
					class="relative p-0 m-0 w-full h-300px"
				></div>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="dialogVisible = false"
							>取消</el-button
						>
					</span>
				</template>
			</el-dialog>
		</div>
	</div>
</template>

<script setup lang="ts" name="index">
import {
	PieChart,
	ChatDotSquare,
	CopyDocument,
	EditPen,
	CircleClose,
	ArrowDown,
	Clock,
	Search,
	FullScreen,
	Minus,
} from "@element-plus/icons-vue";
import { ElDialog } from "element-plus";
import AMapLoader from "@amap/amap-jsapi-loader";
import { onMounted, reactive, ref, watch } from "vue";
import axios from "axios";

import tljGrey from "/$/bigscreen/static/tlj-grey.svg";
import tljRed from "/$/bigscreen/static/tlj-red.svg";
import pointerMarker from "/$/bigscreen/static/pointer-marker.svg";

let map: any = reactive({});
const main: any = ref(null);
const positionArr = ref([120.41908, 30.440908]);
const tljImage = ref(tljGrey);
const tljData: any = ref({});
let marker: any = null;
let polygon1: any = null;
let polygon2: any = null;
let text1: any = null;
let text2: any = null;
let text3: any = null;
let mousetool: any = null;
let lnglat: any = null;
const fullscreen: any = ref(null);
const checkedComponent = ref(["统计", "动态", "图层"]);
const rightComponent = ref(["统计", "动态", "图层", "测距"]);
const checkList: any = ref([]);
const checkListName = ref([]);
const checkListSerialNum = ref([]);
const checkListColor = ref([]);
const checkListBoundary = ref([]);
const checkList2 = ref([]);
const checkList2Name = ref([]);
const checkList2SerialNum = ref([]);
let sstjDataList: any = reactive({});
const component1Ref: any = ref(null);
const component2Ref: any = ref(null);
const component3Ref: any = ref(null);
const componentIcon1Ref: any = ref(null);
const componentIcon2Ref: any = ref(null);
const componentIcon3Ref: any = ref(null);
const state = ref("");
const links: any = ref([]);
const njInfoWindowRef: any = ref(null);
const dialogVisible = ref(false);
const historeTraceDataList: any = ref([]);
const pointerMarkerImage = ref(pointerMarker);
const dialogFullScreen = ref(false);

//搜索框输入搜索器触发后台接口数据
const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
	links.value = loadAll();
	const results = queryString
		? links.value.filter(createFilter(queryString))
		: links.value;
	let cbResults: any = [];
	results.forEach((result: any) => {
		cbResults.push({
			value: result.name + "(" + result.serialNum + ")",
			boundary: result.boundary,
		});
	});

	cb(cbResults);
};

//返回后台搜索结果数组
const loadAll = () => {
	if (state.value === "") {
		return [];
	}
	// var config = {
	// 	method: "get",
	// 	url: "/api/admin/terminal/info/search?keyword=" + state.value,

	// axios(config).then(function (response) {
	// 	//服务器有返回
	// 	if (response.status == 200) {
	// 		//请求成功
	// 		if (response.data.code == 1000) {
	// 			//处理返回结果
	// 		} else {
	// 			console.log("获取搜索结果失败");
	// 		}
	// 	} else {
	// 		throw new Error("获取搜索结果失败");
	// 	}
	// });
	let data = [
		{
			id: 1,
			createTime: "2023-02-18 01:13:50",
			updateTime: "2023-02-19 06:59:46",
			serialNum: "1600789",
			name: "轮式拖拉机",
			model: "轮式拖拉机",
			size: "135*60*80cm",
			type: 0,
			deviceId: "2022",
			longitude: 120.4140917055,
			latitude: 30.443156792333337,
		},
		{
			id: 1,
			createTime: "2023-01-07 18:03:25",
			updateTime: "2023-03-10 10:42:37",
			serialNum: "10010002",
			name: "一区2号地块",
			growCrops: 15,
			color: "rgba(255, 69, 0, 0.68)",
			remark: null,
			boundary: [
				[120.415671, 30.44185],
				[120.417236, 30.441868],
				[120.417228, 30.442743],
				[120.41565, 30.442753],
			],
			area: 21,
		},
		{
			id: 2,
			createTime: "2023-01-08 12:16:12",
			updateTime: "2023-03-27 15:42:01",
			serialNum: "10010001",
			name: "一区1号地块",
			growCrops: 12,
			color: "rgba(199, 21, 133, 1)",
			remark: null,
			boundary: [
				[120.418675, 30.441864],
				[120.417312, 30.441864],
				[120.417307, 30.442753],
				[120.418656, 30.442745],
			],
			area: 19.3,
		},
	];
	let result: any = [];
	data.forEach((item: any) => {
		if (item.type == 0) {
			let dataItem = {
				name: item.name,
				serialNum: item.serialNum,
				boundary: [item.longitude + 0.005, item.latitude - 0.00225],
			};
			result.push(dataItem);
		} else {
			let dataItem = {
				name: item.name,
				serialNum: item.serialNum,
				boundary: item.boundary[0],
			};
			result.push(dataItem);
		}
	});
	return result;
};
//对搜索出的结果进行筛选和大小写转换
const createFilter = (queryString: string) => {
	return (restaurant: any) => {
		if (
			restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) ===
			0
		) {
			return restaurant;
		} else {
			if (
				restaurant.serialNum
					.toLowerCase()
					.indexOf(queryString.toLowerCase()) !== -1
			) {
				return restaurant;
			}
		}
	};
};
//点击下拉框搜索结果进行地图位移
const handleSelect: any = (item: any) => {
	map.setCenter(item.boundary);
	state.value = "";
};

//点击搜索按钮触发事件（不做处理）
const handleButtonClick = (ev: Event) => {
	querySearchAsync;
};

//右侧组件4个的点击事件
const handleChange: any = (val: string[]) => {
	if (val.includes("统计")) {
		component1Ref.value.classList.remove("component-hide");
	} else {
		component1Ref.value.classList.add("component-hide");
	}
	if (val.includes("动态")) {
		component2Ref.value.classList.remove("component-hide");
	} else {
		component2Ref.value.classList.add("component-hide");
	}
	if (val.includes("图层")) {
		component3Ref.value.classList.remove("component-hide");
	} else {
		component3Ref.value.classList.add("component-hide");
	}
	if (val.includes("测距")) {
		mousetool.rule();
		map.on("mousemove", (e: any) => {
			lnglat.setLng(e.lnglat.lng);
			lnglat.setLat(e.lnglat.lat);
			text3.setPosition(lnglat);
		});

		text3.show();
	} else {
		mousetool.close(true);
		text3.hide();
	}
};

//初始化地图
const initMap = () => {
	window._AMapSecurityConfig = {
		securityJsCode: "ab50347180e98051a8caac09781b9f6e",
	};
	AMapLoader.load({
		// 申请好的Web端开发者Key
		key: "dcb3841ae0e471fed5651fea3aa69487",
		version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
		plugins: ["AMap.ToolBar", "AMap.MouseTool"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
	})
		.then(AMap => {
			// 初始化地图
			map = new AMap.Map("container", {
				//设置地图容器id
				zoom: 16.5, //设置地图显示的缩放级别
				center: [120.417754, 30.441805], //设置地图中心点坐标
				layers: [new AMap.TileLayer.Satellite()], //设置图层,可设置成包含一个或多个图层的数组
				mapStyle: "amap://styles/whitesmoke", //设置地图的显示样式
				viewMode: "2D", //设置地图模式，
				//pitch:45 //俯仰角度，默认 0，最大值根据地图当前 zoom 级别不断增大，2D地图下无效 。
			});

			//1.添加比例尺放大缩小控件
			map.addControl(
				new AMap.ToolBar({
					position: "LB",
				})
			);

			// 2.将拖拉机图标添加到map上
			marker = new AMap.Marker({
				position: new AMap.LngLat(
					positionArr.value[0],
					positionArr.value[1]
				),
				offset: new AMap.Pixel(-10, -10),
				icon: new AMap.Icon({
					size: new AMap.Size(40, 50), // 图标尺寸
					image: tljImage.value,
					imageOffset: new AMap.Pixel(0, 0), // 图像相对展示区域的偏移量，适于雪碧图等
					imageSize: new AMap.Size(20, 20), // 根据所设置的大小拉伸或压缩图片
				}),
				title: "拖拉机",
				zoom: 11,
			});
			map.add(marker);
			//2.1监听拖拉机图标点击事件
			marker.on("click", function (e: any) {
				let infoWindow = new AMap.InfoWindow({
					content: njInfoWindowRef.value,
					anchor: "bottom-center",
				});
				// 在地图上打开信息窗体
				infoWindow.open(map, [e.lnglat.lng, e.lnglat.lat]);
			});

			//3.添加地块覆盖物
			polygon1 = new AMap.Polygon({
				path: checkListBoundary.value[0],
				fillColor: checkListColor.value[0], // 多边形填充颜色
				borderWeight: 2, // 线条宽度，默认为 1
				strokeColor: checkListColor.value[0], // 线条颜色
			});
			polygon2 = new AMap.Polygon({
				path: checkListBoundary.value[1],
				fillColor: checkListColor.value[1], // 多边形填充颜色
				borderWeight: 2, // 线条宽度，默认为 1
				strokeColor: checkListColor.value[1], // 线条颜色
			});
			//多边形 Polygon对象添加到 Map
			map.add(polygon1);
			map.add(polygon2);
			// 缩放地图到合适的视野级别
			//map.setFitView([polygon]);

			//3.1添加地块名称文本
			let path = checkListBoundary.value[0];
			text1 = new AMap.Text({
				map,
				position: new AMap.LngLat(
					(path[0][0] + path[3][0]) / 2,
					(path[0][1] + path[3][1]) / 2
				),
				text: checkListName.value[0],
				anchor: "center",
				offset: new AMap.Pixel(52, 0),
				style: {
					fontSize: 6,
					color: "white",
					background: "transparent",
					border: "none",
				},
			});
			text1.setMap(map);
			path = checkListBoundary.value[1];
			text2 = new AMap.Text({
				map,
				position: new AMap.LngLat(
					(path[0][0] + path[3][0]) / 2,
					(path[0][1] + path[3][1]) / 2
				),
				text: checkListName.value[1],
				anchor: "center",
				offset: new AMap.Pixel(-35, 0),
				style: {
					fontSize: 6,
					color: "white",
					background: "transparent",
					border: "none",
				},
			});
			text2.setMap(map);

			//4.添加地图测距功能
			mousetool = new AMap.MouseTool(map);
			//4.1跟随鼠标的文本
			lnglat = new AMap.LngLat(
				(path[0][0] + path[3][0]) / 2,
				(path[0][1] + path[3][1]) / 2
			);
			text3 = new AMap.Text({
				map,
				position: lnglat,
				text: "单机地图选择拐点,右击地图完成绘制并计算距离",
				anchor: "center",
				offset: new AMap.Pixel(200, 0),
			});
			text3.setMap(map);
			text3.hide();
		})
		.catch(e => {
			console.log(e);
		});
};

//获取拖拉机位置
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
				//拖拉机位置
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

watch(positionArr, newVal => {
	// const lnglat = new AMap.LngLat(newVal[0] + 0.005, newVal[1] - 0.00225);
	// marker.setPosition(lnglat);
	var position = [newVal[0] + 0.005, newVal[1] - 0.00225];
	marker.setPosition(position);
});

//获取地块管理信息
const getDkData = async () => {
	// var config = {
	// 	method: "post",
	// 	url: "/api/admin/field/info/list",
	// };

	// await axios(config).then(function (response) {
	// 	//服务器有返回
	// 	if (response.status == 200) {
	// 		//请求成功
	// 		if (response.data.code == 1000) {
	//
	// 		} else {
	// 			console.log("获取地块信息失败");
	// 		}
	// 	} else {
	// 		throw new Error("获取地块信息失败");
	// 	}
	// });
	let data = [
		{
			id: 1,
			createTime: "2023-01-07 18:03:25",
			updateTime: "2023-03-10 10:42:37",
			name: "一区2号地块",
			serialNum: "10010002",
			color: "rgba(255, 69, 0, 0.68)",
			boundary: [
				[120.415671, 30.44185],
				[120.417236, 30.441868],
				[120.417228, 30.442743],
				[120.41565, 30.442753],
			],
			area: 21,
			growCrops: 15,
			remark: null,
		},
		{
			id: 2,
			createTime: "2023-01-08 12:16:12",
			updateTime: "2023-03-27 15:42:01",
			name: "一区1号地块",
			serialNum: "10010001",
			color: "rgba(199, 21, 133, 1)",
			boundary: [
				[120.418675, 30.441864],
				[120.417312, 30.441864],
				[120.417307, 30.442753],
				[120.418656, 30.442745],
			],
			area: 19.3,
			growCrops: 12,
			remark: null,
		},
	];
	let idList: any = [];
	let nameList: any = [];
	let serialNumList: any = [];
	let colorList: any = [];
	let boundaryList: any = [];
	data.forEach(item => {
		idList.push(item.id.toString());
		nameList.push(item.name);
		serialNumList.push(item.serialNum);
		colorList.push(item.color);
		boundaryList.push(item.boundary);
	});
	checkList.value = idList;
	checkListName.value = nameList;
	checkListSerialNum.value = serialNumList;
	checkListColor.value = colorList;
	checkListBoundary.value = boundaryList;
};

//获取农机管理信息
const getNjData = async () => {
	var config = {
		method: "post",
		url: "/api/admin/terminal/info/list",
	};

	await axios(config).then(function (response) {
		//服务器有返回
		if (response.status == 200) {
			//请求成功
			if (response.data.code == 1000) {
				//农机管理信息
				let idList: any = [];
				let nameList: any = [];
				let serialNumList: any = [];
				response.data.data.forEach((item: any) => {
					idList.push(item.id.toString());
					nameList.push(item.name);
					serialNumList.push(item.serialNum);
				});
				checkList2.value = idList;
				checkList2Name.value = nameList;
				checkList2SerialNum.value = serialNumList;
				tljData.value = response.data.data[0];
			} else {
				console.log("获取农机管理失败");
			}
		} else {
			throw new Error("获取农机管理失败");
		}
	});
};

//获取实时统计信息
const getSstjData = async () => {
	// var config = {
	// 	method: "get",
	// 	url: "/api/admin/terminal/info/statistics",
	// };

	// await axios(config).then(function (response) {
	// 	//服务器有返回
	// 	if (response.status == 200) {
	// 		//请求成功
	// 		if (response.data.code == 1000) {
	// 			//实时统计信息
	// 			sstjDataList=response.data.data;
	// 		} else {
	// 			console.log("获取实时统计失败");
	// 		}
	// 	} else {
	// 		throw new Error("获取实时统计失败");
	// 	}
	// });
	let data = {
		onlineCount: 0,
		offlineCount: 1,
		fieldCount: 2,
	};
	sstjDataList = data;
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

//添加历史轨迹全图点击事件
const historyFullScreenClick = () => {
	var dialogEl: any = document.getElementById("historyDialogRef");
	var containerEl: any = document.getElementById("historyTaceContainer");
	if (!dialogFullScreen.value) {
		dialogEl.style.position = "fixed";
		dialogEl.style.top = "0";
		dialogEl.style.left = "0";
		dialogEl.style.width = "100%";
		dialogEl.style.height = "100%";
		dialogEl.style.margin = "0";
		dialogEl.style.padding = "0";
		containerEl.style.height = "550px"; // 50px是header的高度
	} else {
		dialogEl.style.position = "";
		dialogEl.style.top = "";
		dialogEl.style.left = "";
		dialogEl.style.width = "";
		dialogEl.style.height = "";
		dialogEl.style.margin = "";
		dialogEl.style.padding = "";
		containerEl.style.height = "300px";
	}
	dialogFullScreen.value = !dialogFullScreen.value;
};

//右侧组件添加监听事件
const addEventListenerRight = () => {
	componentIcon1Ref.value.addEventListener("click", () => {
		componentIcon1RefClick();
	});
	componentIcon2Ref.value.addEventListener("click", () => {
		componentIcon2RefClick();
	});
	componentIcon3Ref.value.addEventListener("click", () => {
		componentIcon3RefClick();
	});
};

const componentIcon1RefClick = () => {
	if (component1Ref.value) {
		component1Ref.value.classList.add("component-hide");
		checkedComponent.value = checkedComponent.value.filter(
			(item, index) => {
				if (item != "统计") {
					return item;
				}
			}
		);
	} else {
		component1Ref.value.show();
	}
};

const componentIcon2RefClick = () => {
	if (component2Ref.value) {
		component2Ref.value.classList.add("component-hide");
		checkedComponent.value = checkedComponent.value.filter(
			(item, index) => {
				if (item != "动态") {
					return item;
				}
			}
		);
	} else {
		component2Ref.value.show();
	}
};

const componentIcon3RefClick = () => {
	if (component3Ref.value) {
		component3Ref.value.classList.add("component-hide");
		checkedComponent.value = checkedComponent.value.filter(
			(item, index) => {
				if (item != "图层") {
					return item;
				}
			}
		);
	} else {
		component3Ref.value.show();
	}
};

//图层管理勾选框事件
const changeCheckbox: any = (value: string[]) => {
	if (value.includes("1")) {
		map.add(polygon1);
		text1.show();
	} else {
		map.remove(polygon1);
		text1.hide();
	}
	if (value.includes("2")) {
		map.add(polygon2);
		text2.show();
	} else {
		map.remove(polygon2);
		text2.hide();
	}
};
const changeCheckbox2: any = (value: string[]) => {
	if (value.includes("1")) {
		map.add(marker);
	} else {
		map.remove(marker);
	}
};

//点击历史轨迹展开Dialog弹窗
const showHistoryDialog = () => {
	dialogVisible.value = true;
	initHistoryTraceMap();
};

//获得历史轨迹数据
const getNjHistoreTraceData = () => {
	// var config = {
	// 	method: "post",
	// 	url: "/api/admin/work/track/tracks",
	// };
	// axios(config).then(function (response) {
	// 	//服务器有返回
	// 	if (response.status == 200) {
	// 		//请求成功
	// 		if (response.data.code == 1000) {
	// 			//历史轨迹信息
	// 			console.log(response.data.data);
	// 			//historeTraceDataList=response.data.data;
	// 		} else {
	// 			console.log("获取历史轨迹失败");
	// 		}
	// 	} else {
	// 		throw new Error("获取历史轨迹失败");
	// 	}
	// });
	let data = [
		{
			id: 6452,
			createTime: "2023-03-11 12:20:54",
			updateTime: "2023-03-11 12:20:54",
			workId: "1",
			longitude: 120.41251743183336,
			latitude: 30.44430653400001,
			speed: 0.1,
			time: "2023-03-11 12:18:38",
		},
		{
			id: 6453,
			createTime: "2023-03-11 12:20:55",
			updateTime: "2023-03-11 12:20:55",
			workId: "1",
			longitude: 120.412517424,
			latitude: 30.444306389,
			speed: 0.3,
			time: "2023-03-11 12:18:38",
		},
		{
			id: 6454,
			createTime: "2023-03-11 12:20:56",
			updateTime: "2023-03-11 12:20:56",
			workId: "1",
			longitude: 120.41251725833332,
			latitude: 30.44430482733333,
			speed: 2.4,
			time: "2023-03-11 12:18:38",
		},
		{
			id: 6455,
			createTime: "2023-03-11 12:20:57",
			updateTime: "2023-03-11 12:20:57",
			workId: "1",
			longitude: 120.4125183413333,
			latitude: 30.44429531283334,
			speed: 5.1,
			time: "2023-03-11 12:18:38",
		},
		{
			id: 6456,
			createTime: "2023-03-11 12:20:58",
			updateTime: "2023-03-11 12:20:58",
			workId: "1",
			longitude: 120.4125194175,
			latitude: 30.444284390166665,
			speed: 4.2,
			time: "2023-03-11 12:18:38",
		},
		{
			id: 6457,
			createTime: "2023-03-11 12:20:59",
			updateTime: "2023-03-11 12:20:59",
			workId: "1",
			longitude: 120.41252087516672,
			latitude: 30.444273759666665,
			speed: 3.9,
			time: "2023-03-11 12:18:38",
		},
		{
			id: 6458,
			createTime: "2023-03-11 12:21:00",
			updateTime: "2023-03-11 12:21:00",
			workId: "1",
			longitude: 120.41252133916667,
			latitude: 30.44426299766667,
			speed: 3.3,
			time: "2023-03-11 12:18:38",
		},
		{
			id: 6459,
			createTime: "2023-03-11 12:21:01",
			updateTime: "2023-03-11 12:21:01",
			workId: "1",
			longitude: 120.41252155033332,
			latitude: 30.444253334166667,
			speed: 3.7,
			time: "2023-03-11 12:18:38",
		},
		{
			id: 6460,
			createTime: "2023-03-11 12:21:02",
			updateTime: "2023-03-11 12:21:02",
			workId: "1",
			longitude: 120.412522392,
			latitude: 30.44424892566667,
			speed: 0.6,
			time: "2023-03-11 12:18:38",
		},
		{
			id: 6461,
			createTime: "2023-03-11 12:21:03",
			updateTime: "2023-03-11 12:21:03",
			workId: "1",
			longitude: 120.41252237000002,
			latitude: 30.444249531166676,
			speed: 0.4,
			time: "2023-03-11 12:18:38",
		},
		{
			id: 6462,
			createTime: "2023-03-11 12:21:04",
			updateTime: "2023-03-11 12:21:04",
			workId: "1",
			longitude: 120.4125207741667,
			latitude: 30.44425657266667,
			speed: 5.9,
			time: "2023-03-11 12:18:38",
		},
		{
			id: 6463,
			createTime: "2023-03-11 12:21:05",
			updateTime: "2023-03-11 12:21:05",
			workId: "1",
			longitude: 120.4125213943333,
			latitude: 30.44426860233334,
			speed: 4.9,
			time: "2023-03-11 12:18:38",
		},
		{
			id: 6464,
			createTime: "2023-03-11 12:21:06",
			updateTime: "2023-03-11 12:21:06",
			workId: "1",
			longitude: 120.41252053166666,
			latitude: 30.44428037483333,
			speed: 3.8,
			time: "2023-03-11 12:18:38",
		},
		{
			id: 6465,
			createTime: "2023-03-11 12:21:07",
			updateTime: "2023-03-11 12:21:07",
			workId: "1",
			longitude: 120.412521398,
			latitude: 30.444292667,
			speed: 6,
			time: "2023-03-11 12:18:38",
		},
		{
			id: 6466,
			createTime: "2023-03-11 12:21:08",
			updateTime: "2023-03-11 12:21:08",
			workId: "1",
			longitude: 120.41252094416669,
			latitude: 30.444307559500007,
			speed: 6,
			time: "2023-03-11 12:18:38",
		},
		{
			id: 6467,
			createTime: "2023-03-11 12:21:09",
			updateTime: "2023-03-11 12:21:09",
			workId: "1",
			longitude: 120.41252277466666,
			latitude: 30.444319972,
			speed: 3.8,
			time: "2023-03-11 12:18:38",
		},
		{
			id: 6468,
			createTime: "2023-03-11 12:21:10",
			updateTime: "2023-03-11 12:21:10",
			workId: "1",
			longitude: 120.41252260483334,
			latitude: 30.44432514183334,
			speed: 0.3,
			time: "2023-03-11 12:18:38",
		},
	];
	historeTraceDataList.value = data;
};

//初始化历史轨迹地图
const initHistoryTraceMap = () => {
	window._AMapSecurityConfig = {
		securityJsCode: "ab50347180e98051a8caac09781b9f6e",
	};
	AMapLoader.load({
		// 申请好的Web端开发者Key
		key: "dcb3841ae0e471fed5651fea3aa69487",
		version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
		plugins: ["AMap.ToolBar", "AMap.MouseTool"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
	})
		.then(AMap => {
			// 初始化地图
			const map = new AMap.Map("historyTaceContainer", {
				//设置地图容器id
				zoom: 16.5, //设置地图显示的缩放级别
				center: [120.417754, 30.441805], //设置地图中心点坐标
				layers: [new AMap.TileLayer.Satellite()], //设置图层,可设置成包含一个或多个图层的数组
				mapStyle: "amap://styles/whitesmoke", //设置地图的显示样式
				viewMode: "2D", //设置地图模式，
				//pitch:45 //俯仰角度，默认 0，最大值根据地图当前 zoom 级别不断增大，2D地图下无效 。
			});
			let marker = null;
			historeTraceDataList.value.forEach((item: any) => {
				marker = new AMap.Marker({
					position: [item.longitude, item.latitude],
					icon: new AMap.Icon({
						size: new AMap.Size(20, 20), // 图标尺寸
						image: pointerMarkerImage.value,
						imageOffset: new AMap.Pixel(0, 0), // 图像相对展示区域的偏移量，适于雪碧图等
						imageSize: new AMap.Size(20, 20), // 根据所设置的大小拉伸或压缩图片
					}),
				});
				map.add(marker);
			});
		})
		.catch(e => {
			console.log(e);
		});
};

onMounted(() => {
	getDkData();
	getNjData();
	getSstjData();
	initMap();
	getFullScreenController();
	addEventListenerRight();
	getNjHistoreTraceData();
	setInterval(() => {
		getTljData();
	}, 10000);
});
</script>
<style scoped lang="scss">
.fullscreen-control-in {
	position: absolute;
	top: 5px;
	left: 5px;
	width: 20px;
	height: 20px;
	background: url(../../static/in-full-screen.svg) no-repeat center center;
	background-size: contain;
	cursor: pointer;
}
.fullscreen-control-out {
	position: absolute;
	width: 30px;
	height: 30px;
	background: url(../../static/out-full-screen.svg) no-repeat center center;
	background-size: cover;
	cursor: pointer;
}
.component-hide {
	display: none;
}
.svg-icon {
	width: 20px;
	height: 20px;
	background: url(../../static/old-trace.svg) no-repeat center center;
	background-size: cover;
}
</style>
