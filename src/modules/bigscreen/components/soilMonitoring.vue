<!--土壤监测-->
<template>
	<div
		v-loading="loading"
		class="w-full h-full bg-black bg-opacity-10 backdrop-filter backdrop-blur-6 text-white"
		ref="main"
	>
		<div class="flex flex-col">
			<div class="pl-4 flex items-center flex-1 resize_value_1">
				<el-icon><FullScreen class="text-green" /></el-icon>
				<span class="ml-2 text-white"
					>土壤监测 - 杨渡{{
						props.data.index == 1 ? "T1329" : "T8741"
					}}</span
				>
			</div>
			<div class="flex ml-0.3vw mr-0.1vw h-0.2vh">
				<div class="w-1.5vw bg-white h-3px"></div>
				<div class="w-17.3vw bg-white mt-2px flex-1 h-1px"></div>
				<div class="w-0.6vw h-3px bg-[#8FFFA2]"></div>
			</div>
		</div>
		<div
			class="flex pt-0.1rem"
			element-loading-background="rgba(122, 122, 122, 0.3)"
		>
			<div class="flex flex-wrap p-4" v-if="props.data.showMessage">
				<div
					v-for="(item, index) in props.data.data"
					:key="index"
					class="resize_value_5"
				>
					<div
						class="flex flex-col items-center justify-center text-white"
					>
						<div class="flex items-end">
							<div class="resize_value_2">
								{{ item.value }}
							</div>
							<div class="resize_value_3 ml-1.5px leading-5">
								{{ item.unit }}
							</div>
						</div>
						<div class="resize_value_4 opacity-70">
							{{ item.name }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="soil-monitoring">
import { FullScreen } from "@element-plus/icons-vue";
import { computed, ref, watch } from "vue";
import { useResizeObserver } from "@vueuse/core";
const main = ref();
const loading = ref(true);
const font_size_value = ref("17.1px");
const font_size_value_1 = ref("3px");
const line_height_value = ref("31.72px");
const line_height_value_3 = ref("31.72px");
const h_value = ref("55px");

useResizeObserver(main, entries => {
	const entry = entries[0];
	const { width, height } = entry.contentRect;
	if (width < 306) {
		font_size_value.value = 0.06 * width + "px";
		font_size_value_1.value = 0.01 * width + "px";
		line_height_value.value = 0.15 * height + "px";
		line_height_value_3.value = 0.01 * height + "px";
		h_value.value = 0.25 * height + "px";
	}
});

const props: any = defineProps({
	data: {
		type: Object,
		default: {
			data: null,
			index: 1,
			showMessage: true,
		},
	},
});
watch(props, newValue => {
	loading.value = !newValue.data.showMessage;
});
</script>
<style lang="less" scoped>
:deep(.el-loading-mask) {
	background-color: rgba(0, 0, 0, 0);
}

.resize_value_1 {
	height: v-bind("line_height_value");
	line-height: v-bind("line_height_value");
	font-size: v-bind("font_size_value");
}

.resize_value_2 {
	font-size: v-bind("font_size_value");
}
.resize_value_3 {
	scale: 0.6;
	font-size: v-bind(font_size_value_1);
}

.resize_value_4 {
	scale: 0.6;
	font-size: v-bind(font_size_value_1);
	line-height: v-bind("font_size_value_1");
	margin-top: 3px;
	font-family: TengXiangJiaLiXiYuanJian, sans-serif;
}

.resize_value_5 {
	height: v-bind(h_value);
	width: 33%;
}
</style>
