<template>
	<li v-if="!browser.isMini">
		<div class="btn" @click="toCode">
			<span>
				<i class="iconfont icon-diannao"></i>
			</span>
			<span>数据大屏</span>
		</div>
	</li>
</template>

<script lang="ts" name="auto-menu" setup>
import { useCool } from "/@/cool";

const { router, browser } = useCool();

function toCode() {
	router.push("/data/screen");
}
</script>

<style lang="scss" scoped>
.btn {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 12px;
	background-color: #2f3447;
	color: #fff;
	font-weight: 600;
	height: 22px;
	width: 76px;
	position: relative;

	span {
		&:nth-child(1) {
			margin-right: 5px;
			background-color: #fff;
			color: #000;
			padding: 0 1px;
		}
	}

	&:hover {
		background-color: var(--color-primary);
	}
}
</style>
