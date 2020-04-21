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
	import guanzhidrawer from './tools/guanzh-Drawer.vue'

	import timeDiv from './tools/timeDiv.vue'

	export default {
		components: {
			login,
			drawer,
			timeDiv,
			guanzhidrawer
		},
		beforeCreate() {
			let count = 0;
			let imgs = [
				//用require的方式添加图片地址，直接添加图片地址的话，在build打包之后会查找不到图片，因为打包之后的图片名称会有一个加密的字符串
				require('../static/img/commonEventBg.png'),
				require('../static/img/guanzhiBG.png'),
				require('../static/img/personBoard.png')
			]
			for(let img of imgs) {
				let image = new Image();
				image.src = img;
				image.onload = () => {
					count++;
				};
			}
		},
		computed: {
			key() {
				return this.$route.fullPath
			},
			Drawer() {
				return this.$store.state.Drawer
			},
		},
		mounted() {
			this.QueryEnum()
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
			QueryEnum() {
				let option = {
					tablename: "dct_enums",
					showcol: ['*'],
					sqlwhere: " 1=1"
				}
				axios.get(this.$store.state.MYURL + 'QueryTableRow.do', {
						params: {
							tablename: option.tablename,
							showcol: option.showcol.join(","),
							sqlwhere: option.sqlwhere
						}
					})
					.then(function(response) {
						localStorage.setItem("dct_enums",JSON.stringify(response.data.data))
					})
			},
			GetImg() {

			}

		}
	}
</script>

<style lang="less">
	@import 'assets/styles/common';
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
