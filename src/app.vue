<template>
	<div id="app">
		<router-view :key="key"></router-view>
		<el-drawer title="" :visible.sync="Drawer" :direction="direction" :before-close="handleClose" size='28.64%' class="personDrawer">
			<div class="top">
				<div class="floor1">
					<div class="close"></div>
				</div>
				<div class="floor2">
					<div class="left">
						<div class="floor1">
							<!--<div class="lord">
								<div class="circle"></div>
								<div class="lordName">领主</div>
							</div>-->
							<div class="yours">
								<div class="circle"></div>
								<div class="yoursName">配偶</div>
							</div>
							<div class="you" v-bind:style="{backgroundImage:'url(' + PersonData[0].imgURL + ')'}">
								<div class="circle"></div>
							</div>
						</div>
						<div class="floor2"></div>
					</div>
					<div class="right">
						<div class="top"></div>
						<div class="bottom">
							<div class="attribute1">
								<el-tooltip class="item" effect="light" v-for="(item,index) in PersonData" placement="bottom">
									<div slot="content">{{item.F_name}}<br/>{{item.attrF_caption}}</div>
									<div class="item" :key="index" v-bind:style="{backgroundImage:'url(' + item.attrUrl + ')'}"></div>
								</el-tooltip>
							</div>
							<div class="attribute2"></div>
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
			PersonData() {
				return this.$store.state.PersonData
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
			},
			QueryData() {

			}
		}
	}
</script>

<style lang="less">
	@import './style/common';
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
	
	.personDrawer {
		height: 36.46vw;
		.el-drawer__header {
			display: none;
		}
		.el-drawer.ltr {
			background-image: url("./assets/images/personboard.bmp");
			background-size: 100% 100%;
			background-repeat: no-repeat;
		}
		.top {
			height: 54%;
			width: 100%;
			>.floor1 {
				height: 10%;
				position: relative;
				.close {
					cursor: pointer;
					height: 1.2vw;
					width: 1.2vw;
					position: absolute;
					right: 3%;
					top: 23%;
					background-image: url("./assets/images/close.png");
					background-size: 100% 100%;
					background-repeat: no-repeat;
				}
			}
			>.floor2 {
				height: 93%;
				margin: 0 10px 10px 10px;
				.left {
					float: left;
					width: 60%;
					height: 100%;
					.floor1 {
						height: 74%;
						width: 100%;
						position: relative;
						.circle {
							height: 100%;
							width: calc(100% + 4px);
							border-radius: 100%;
						}
						.lord {
							height: 3vw;
							width: 3vw;
							position: absolute;
							top: 1.4vw;
							right: 4vw;
							border-radius: 3vw;
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
							bottom: 12%;
							left: 20%;
							z-index: 1;
							background-size: 100% 100%;
							background-repeat: no-repeat;
						}
						.yours {
							height: 5.55vw;
							width: 5.55vw;
							border-radius: 5.55vw;
							position: absolute;
							bottom: 14%;
							right: 1%;
							z-index: 2;
							.yoursName {
								height: 1.4vw;
								line-height: 1.4vw;
								width: 5.55vw;
								background-image: url("./assets/images/name.png");
								background-size: 100% 100%;
								background-repeat: no-repeat;
								position: absolute;
								bottom: -14%;
								left: -4%;
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
					.top {
						height: 85%;
						width: 100%;
					}
					.bottom {
						height: 15%;
						width: 100%;
						.attribute1 {
							height: 45%;
							width: 100%;
							.item {
								height: 100%;
								width: 1.2vw;
								float: left;
								cursor: pointer;
							}
						}
						.attribute2 {
							height: 55%;
							width: 100%;
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