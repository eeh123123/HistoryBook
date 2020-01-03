<template>
	<div class="Dct">
		<div class="floor1">
		</div>
		<div class="floor2">
			<div class="son1">
				<div class="box">
					<div class="border"></div>
				</div>
			</div>
			<div class="son2">
				<EditDialog ref="edit_dialog" :visible="true" :title="'字典表'" :handleCurrentChange="handleCurrentChange" :handleSizeChange="handleSizeChange" :callBack="cbFunc" :tableHead="tableHead" :tableData.sync="tableData"></EditDialog>
			</div>
		</div>
	</div>
</template>

<script>
	import EditDialog from '../tools/EditDialog.vue'
	let vm;
	export default {
		components: {
			EditDialog
		},
		data() {
			return {
				tableHead: [],
				tableData: [],
				cbFunc: function() {},
			}
		},
		mounted() {
			vm = this;
		},
		methods: {
			handleCurrentChange() {

			},
			handleSizeChange() {

			}
		}

	}
</script>

<style lang="less">
	.Dct {
		background-image: url("../assets/images/bg.jpg");
		width: 100%;
		height: 100%;
		.floor1 {
			width: 100%;
			height: 10%;
		}
		.floor2 {
			width: 100%;
			height: 90%;
			.son1 {
				float: left;
				width: 30%;
				height: 100%;
				box-sizing: border-box;
				padding: 1px;
				border-radius: 10px;
				background-image: -webkit-linear-gradient(left, #124e9a 0%, #3cbded 50%, #124e9a 90%);
				.box {
					border-radius: 10px;
					background: #09163d;
					box-shadow: inset 0px 0px 20px rgba( 15, 58, 123, 1);
					padding: 15px;
					box-sizing: border-box;
					height: 100%;
					width: 100%;
					position: relative;
				}
				.box:before {
					content: "";
					width: 25px;
					height: 15px;
					display: block;
					position: absolute;
					top: -3px;
					left: -2px;
				}
				.box:after {
					content: "";
					width: 25px;
					height: 15px;
					display: block;
					position: absolute;
					top: -3px;
					right: -2px;
				}
				.box .border {
					height: 12px;
					width: 100%;
					position: absolute;
					bottom: 0;
					margin: 0;
				}
				.box .border:before {
					content: "";
					width: 25px;
					height: 15px;
					display: block;
					position: absolute;
					top: -3px;
					left: -2px;
				}
				.box .border:after {
					content: "";
					width: 25px;
					height: 15px;
					display: block;
					position: absolute;
					top: -3px;
					right: -2px;
				}
			}
			.son2 {
				float: left;
				width: 70%;
				height: 10px;
			}
		}
	}
</style>