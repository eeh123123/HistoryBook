<template>
	<div id="app">
		<router-view :key="key"></router-view>
		<el-drawer title="" :visible.sync="Drawer" :direction="direction" :before-close="handleClose" size='28.64%' class="personDrawer">
			<div class="top">
				<div class="floor1">
				</div>
				<div class="floor2">
					<div class="left">
						<div class="floor1">
							<div class="lord">
								<div class="circle"></div>
								<div class="lordName">领主</div>
							</div>
							<div class="yours">
								<div class="circle"></div>
								<div class="yoursName">配偶</div>
							</div>
							<div class="you">
								<div class="circle"></div>
							</div>
						</div>
						<div class="floor2"></div>
					</div>
					<div class="right">
						<div class="top"></div>
						<div class="bottom">
							<div class="attribute"></div>
							<div class="attribute"></div>
						</div>

					</div>
				</div>
			</div>
			<div class="bottom">

			</div>
		</el-drawer>
	</div>
</template>

<script>
	import login from './todo/login.vue'

	export default {
		components: {
			login
		},
		computed: {
			key() {
				return this.$route.fullPath
			},
			Drawer() {
				return this.$store.state.Drawer
			},
			personData() {
				return this.$store.state.personData
			}
		},
		data() {
			return {
				direction: 'ltr',
			}
		},
		methods: {
			handleClose() {
				this.$store.commit("setDrawer", false);
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
	
	.personDrawer {
		height: 36.46vw;
		.el-drawer__header {
			display: none;
		}
		.el-drawer.ltr {
			background-image: url("./assets/images/personBG.jpg");
			background-size: 100% 100%;
			background-repeat: no-repeat;
		}
		.top {
			height: 54%;
			width: 100%;
			>.floor1 {
				height: 10%;
			}
			>.floor2 {
				height: 90%;
				margin: 0 10px 10px 10px;
				background-color: white;
				.left {
					float: left;
					width: 60%;
					height: 100%;
					.floor1 {
						height: 74%;
						width: 100%;
						position: relative;
						background-color: yellow;
						.circle {
							height: 100%;
							width: calc(100% + 4px);
							border-radius: 100%;
							background-image: -webkit-linear-gradient( left, #124e9a 0%, #124e9a 20%, #ffffff 30%, #124e9a 40%, #124e9a 90%);
						}
						.lord {
							height: 3vw;
							width: 3vw;
							position: absolute;
							top: 1.4vw;
							right: 4vw;
							border-radius: 3vw;
							background-color: green;
							.lordName {
								height: 1vw;
								width: 3vw;
								background-image: url("./assets/images/name.png");
								background-size: 100% 100%;
								background-repeat: no-repeat;
								position: absolute;
								bottom: -0.5vw;
								left: -4px;
								text-align: center;
								font-size: 0.8vw;
							}
						}
						.you {
							height: 8vw;
							width: 8vw;
							border-radius: 8vw;
							position: absolute;
							bottom: 20%;
							left: 1vw;
							/*background-color: blue;*/
							z-index: 1;
						}
						.yours {
							height: 5.55vw;
							width: 5.55vw;
							border-radius: 5.55vw;
							position: absolute;
							bottom: 20%;
							right: 3vw;
							/*background-color: pink;*/
							border: 4px solid silver;
							z-index: 2;
							.yoursName {
								height: 1vw;
								width: 5.55vw;
								background-image: url("./assets/images/name.png");
								background-size: 100% 100%;
								background-repeat: no-repeat;
								position: absolute;
								bottom: -0.5vw;
								left: -4px;
								text-align: center;
								font-size: 0.8vw;
								z-index: 2;
							}
						}
						.official {}
						.king {}
					}
					.floor2 {
						height: 26%;
						width: 100%;
					}
				}
				.right {
					float: left;
					width: 40%;
					height: 100%;
					border: solid 2px #4C3932;
					.top{
						height: 83%;
						width: 100%;
					}
					.bottom{
						height: 17%;
						width: 100%;
						.attribute{
							height:50%;
							width:100%;
						}
					}
				}
			}
		}
		.bottom {
			height: 46%;
			width: 100%
		}
	}
</style>