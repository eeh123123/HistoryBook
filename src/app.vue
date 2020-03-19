<template>
	<div id="app">
		<router-view :key="key"></router-view>
		<drawer></drawer>
		<guanzhidrawer></guanzhidrawer>
		<timeDiv></timeDiv>
	</div>
</template>

<script>
import login from './todo/login.vue'
import drawer from './tools/person-Drawer.vue'
import guanzhidrawer from './tools/guanzh-Draweri.vue'

import timeDiv from './tools/timeDiv.vue'

export default {
	components: {
		login,
		drawer,
		timeDiv,
		guanzhidrawer
	},
	computed: {
		key() {
			return this.$route.fullPath
		},
		Drawer() {
			return this.$store.state.Drawer
		},
	},
	data() {
		return {
			direction: 'ltr',
		}
	},
	methods: {
		handleClose() {
			this.$store.commit("setDrawer", false);
		},
		QueryData() {

		}
	}
}
</script>

<style lang="less">
	@import 'assets/styles/common';
	/*body {
	cursor: url('http://49.235.128.250:8084/upload/normal.cur'),auto;
}*/

	#app {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	#login {
		width: 60%;
	}
</style>
