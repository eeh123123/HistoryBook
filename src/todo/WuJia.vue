<template>
	<div class="line1">
		<el-form :inline="true" :model="form" ref="form" label-width="100px" class="demo-form-inline" style="min-width: 100%;">
			<el-form-item>
				<el-input v-model="t1" placeholder="请输入内容"></el-input>
			</el-form-item>
			<el-form-item label="物品选择" prop="typeId">
				<el-select v-model="couponSelected" placeholder="请选择" @change="getCouponSelected()">
					<el-option v-for="(item,index) in couponList" :label="item.WUPIN" :value="item.WUPIN" :key="index"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="Search()">查询</el-button>
			</el-form-item>
		</el-form>
		<div class="chart" id="a" style="width: 100%;height: 500px"></div>
		<el-table :data="tlbb_data" style="width: 100%">
			<el-table-column prop="wupin" label="物品名" width="180">
			</el-table-column>
			<el-table-column prop="danj" label="单价" width="180">
			</el-table-column>
			<el-table-column prop="ditu" label="城市" width="180">
			</el-table-column>
			<el-table-column prop="tanwei" label="摊位" width="180">
			</el-table-column>
			<el-table-column prop="zuobiao" label="坐标" width="180">
			</el-table-column>
			<el-table-column prop="tanzhu" label="摊主" width="180">
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	let vm;
	let dom;
	let mychart;
	export default {
		data() {
			return {
				tlbb_data: [],
				myData: [],
				wupin: [],
				zuidijia: [],
				shuliang: [],
				shijian: [],
				MYURL: this.$store.state.MYURL,
				t1: '',
				now: -1,
				couponList: [],
				couponSelected: '',
				form: {
					typeId: ""
				}
			}
		},
		mounted() {
			vm = this;
			vm.$watch('t1', function() {
				$.get(vm.MYURL + 'SearchLike.do?wupin=' + vm.t1, {}, function(result) {
					vm.couponList = [];
					for(var i = 0; i < result.length; i++) {
						vm.couponList.push(result[i]);
					}
				}, "json");
			});
			dom = document.getElementById("a");
			mychart = echarts.init(dom);
		},
		methods: {
			Search: function() {
				$.get(vm.MYURL + 'SearchAxis.do?wupin=' + vm.couponSelected, {}, function(result) {
					vm.myData = [];
					vm.zuidijia = [];
					vm.shuliang = [];
					vm.shijian = [];
					console.log(JSON.stringify(vm.myData));
					vm.wupin = [];
					for(var i = 0; i < result.length; i++) {
						vm.wupin.push(result[i].wupin);
						vm.zuidijia.push(result[i].ZuiDIJIA);
						vm.shuliang.push(result[i].Zdsl);
						vm.shijian.push(result[i].SHIJIAN.substring(0, 16));
					}

					var chart;
					var groupCategories = [];
					var groupColors = [];
					var option = {
						tooltip: {
							trigger: 'axis'
						},
						legend: {
							data: ['数量', '最低价']
						},
						xAxis: [{
							type: 'category',
							data: vm.shijian
						}],
						yAxis: [{
								type: 'value'
							},
							{
								type: 'value',
								axisLabel: {
									formatter: '{value} '
								},
								min: 1,
								max: vm.SearchMax(vm.zuidijia)
							}
						],
						series: [{
								name: '数量',
								type: 'bar',
								// barWidth: '60%',
								data: vm.shuliang,
								itemStyle: {
									normal: {
										color: new echarts.graphic.LinearGradient(
											0, 0, 0, 1, [{
													offset: 0,
													color: '#83bff6'
												},
												{
													offset: 0.5,
													color: '#188df0'
												},
												{
													offset: 1,
													color: '#188df0'
												}
											]
										)
									},
									emphasis: {
										color: new echarts.graphic.LinearGradient(
											0, 0, 0, 1, [{
													offset: 0,
													color: '#2378f7'
												},
												{
													offset: 0.7,
													color: '#2378f7'
												},
												{
													offset: 1,
													color: '#83bff6'
												}
											]
										)
									}
								}
							},
							{
								name: '最低价',
								type: 'line',
								yAxisIndex: 1,
								data: vm.zuidijia
							}
						]
					};
					mychart.setOption(option);
				}, "json");
				$.get(vm.MYURL + 'SearchNow.do?wupin=' + vm.couponSelected, {}, function(result) {
					vm.tlbb_data = result;
				}, "json");
			},
			get: function(ev) {
				if(ev.keyCode == 38 || ev.keyCode == 40) return;

				if(ev.keyCode == 13) {
					window.open(vm.MYURL + 'SearchLike.do?wupin=' + vm.t1);
					vm.t1 = '';
				}
			},
			changeDown: function() {
				vm.now++;
				if(vm.now == vm.myData.length) vm.now = -1;
				vm.t1 = vm.myData[vm.now];
			},
			changeUp: function() {
				vm.now--;
				if(vm.now == -2) vm.now = vm.myData.length - 1;
				vm.t1 = vm.myData[vm.now];
			},
			created: function() {　　　　　　　　　　　　 //如果没有这句代码，select中初始化会是空白的，默认选中就无法实现
				this.couponSelected = this.couponList[0].WUPIN;
			},
			getCouponSelected: function() {
				//获取选中的优惠券
				vm.couponSelected = this.couponSelected;
				console.log(this.couponSelected);
			},
			SearchMax: function(data) {
				var max = 0;
				for(var i = 0; i < data.length; i++) {
					max = data[0].zuidijia;
					if(data[i].zuidijia > max) {
						max = data[i].zuidijia;
					}
				}
				return max;
			}
		}
	}
</script>

<style lang="less">
	@import '../style/mixin';
	.line1 {
		//display: flex;
		justify-content: center;
		padding: 15px;
	}
	
	.el-dropdown-link {
		cursor: pointer;
		color: #409EFF;
	}
	
	.el-icon-arrow-down {
		font-size: 12px;
	}
</style>