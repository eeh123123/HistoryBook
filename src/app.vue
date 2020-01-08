<template>
	<div id="app">
		<router-view :key="key"></router-view>
	</div>
</template>

<script>
	import login from './todo/login.vue'

	export default {
		components: {
			login
		},
		computed:{
			key() {
				return this.$route.fullPath
			}
		}
	}
</script>

<style lang="less">
	@import './style/common';
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