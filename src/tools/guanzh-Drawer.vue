<template>
	<el-drawer :visible.sync="guanzhiDrawer" direction="rtl" size='28.64%' :before-close="handleClose" class="guanzhiDrawer" :modal="false" :withHeader="false">
		<div class="guanzhiBord">
			<div class="title">{{guanzhiData.GuanZhi_MC}}</div>
			<div class="content">
				<el-input type="textarea" v-model="guanzhiData.F_Caption">
				</el-input>
			</div>
			<div class="bottom">
				品阶：
				<el-select v-model="guanzhiData.PinJie_F_MC" filterable placeholder="请选择" @change="changeLocationValue" style="width: 120px;">
					<el-option v-for="item in pinjieOptions" :key="item.F_BH" :label="item.F_MC" :value="item.F_BH">
					</el-option>
				</el-select>
				人数：
				<el-input v-model="guanzhiData.personSize" style="width: 80px">
				</el-input>
				<el-button size="medium " @click="save">记录</el-button>
			</div>
		</div>
	</el-drawer>
</template>

<script>
	let vm
	export default {
		computed: {
			guanzhiDrawer() {
				this.QueryPinJie()
				return this.$store.state.guanzhiDrawer
			},
			guanzhiData() {
				return this.$store.state.guanzhiData
			},
		},
		data() {
			return {
				pinjieValue: '',
				pinjieOptions: {},
				pinJieLable: '',
			}
		},
		mounted() {
			vm = this
		},
		methods: {
			handleClose() {
				this.$store.commit("setguanzhiDrawer", false);
			},
			QueryPinJie() {
				axios.get(this.$store.state.MYURL + 'QueryTableRow.do', {
						params: {
							tablename: "PinJie",
							showcol: "*",
							sqlwhere: " 1=1"
						}
					})
					.then(function(response) {
						vm.pinjieOptions = response.data.data;
					})
			},
			changeLocationValue(val) {
				//locations是v-for里面的也是datas里面的值
				let obj = {};
				obj = this.pinjieOptions.find((item) => {
					return item.F_BH === val;
				});
				this.pinJieLable=obj.F_MC
				this.pinjieValue=obj.F_BH
				this.guanzhiData.PinJie_F_MC = obj.F_MC
				this.guanzhiData.PinJie_F_BH = obj.F_BH
			},
			save() {
				let array_update = [{
					id: this.guanzhiData.id,
					F_Caption: this.guanzhiData.F_Caption||'',
					PinJie:this.pinjieValue,
					personSize:this.guanzhiData.personSize,
				}]
				axios.post(this.$store.state.MYURL + 'UpdateTableRow.do', {
						params: {
							tablename: 'guanzhi',
							values: array_update,
						}
					})
					.then(function(response) {
						vm.$message({
							type: 'success',
							message: response.data.msg
						});
					})
			}
		}
	}
</script>
<style lang="less">
	.guanzhiBord {
		position: relative;
		height: 100%;
		width: 100%;
		font-size: 1vw;
		font-family: LiSu;
		.title {
			position: absolute;
			height: 1.67vw;
			line-height: 1.67vw;
			width: 21.25vw;
			color: white;
			text-align: center;
			top: 2.7%;
			left: 13%;
		}
		.content {
			position: absolute;
			height: 14.69vw;
			line-height: 14.69vw;
			width: 25.05vw;
			color: white;
			text-align: center;
			top: 11.8%;
			left: 6%;
			.el-textarea {
				height: 100%;
				width: 100%;
				padding: 0;
			}
			.el-textarea__inner {
				height: 100%;
				width: 100%;
				background: transparent;
				color: black;
			}
		}
		.bottom {
			position: absolute;
			height: 2.71vw;
			line-height: 2.71vw;
			width: 25.05vw;
			color: black;
			bottom: 12.6%;
			left: 6%;
			padding-left: 20px;
			.el-input__inner {
				background: transparent;
				color: black;
			}
			::-webkit-input-placeholder {
				color: black;
			}
		}
	}
</style>