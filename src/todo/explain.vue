<template>
	<div style="height: 100%">
		<div id="container" style="height: 90%"></div>
		<el-button class="download" type="success" @click="DownLoad()">下载源码</el-button>
	</div>
</template>

<script>
	let vm;
	export default {
		data() {
			return {
				MYURL: this.$store.state.MYURL,
			};
		},
		methods: {
			DownLoad() {
				axios({
					method: 'get',
					url: vm.MYURL + "download_YDM.do",
					data: {},
					responseType: 'arraybuffer'
				}).then((res) => {
					// type 为需要导出的文件类型，此处为xls表格类型
					const blob = new Blob([res.data], {
						type: 'application/vnd.ms-excel'
					});
					// 兼容不同浏览器的URL对象
					const url = window.URL || window.webkitURL || window.moxURL
					// 创建下载链接
					const downloadHref = url.createObjectURL(blob)
					// 创建a标签并为其添加属性
					let downloadLink = document.createElement('a')
					downloadLink.href = downloadHref
					downloadLink.download = '源代码.7z'
					// 触发点击事件执行下载
					downloadLink.click()
				})
			}
		},
		mounted() {
			vm = this;
			var dom = document.getElementById("container");
			var myChart = echarts.init(dom);
			var app = {};
			var option = null;
			myChart.showLoading();

			var data1 = {
				"name": "项目技术背景",
				"textStyle": {
					"fontSize": 20
				},
				"children": [{
						"name": "前端",
						"children": [{
								"name": "webpack",
								"value": "生产库打包，部分大文件如echarts、element-ui使用CDN引用"
							}, {
								"name": "vue",
								"value": "vue-router、render"
							},
							{
								"name": "element-ui",
								"value": "",
								"children": [{
										"name": "Upload 上传",
										"value": ""
									}, {
										"name": "Tag 标签",
										"value": ""
									}, {
										"name": "Tree 树形控件",
										"value": ""
									},
									{
										"name": "Timeline 时间线",
										"value": ""
									},
									{
										"name": "Calendar 日历",
										"value": ""
									}
								]
							}, {
								"name": "echarts",
								"value": "技术说明这种大括号结构(即：{  )一个，物价表的柱状图+折线图一个。"
							}
						]
					},
					{
						"name": "后端",
						"children": [{
								"name": "nodeJS",
								"value": "",
								"children": [{
									"name": "express",
									"value": ""
								}]
							},
							{
								"name": "mysql",
								"value": ""
							}
						]
					}
				]
			};

			myChart.hideLoading();

			myChart.setOption(option = {
				tooltip: {
					trigger: 'item',
					triggerOn: 'mousemove'
				},
				legend: {
					top: '2%',
					left: '3%',
					orient: 'vertical',
					data: [{
						name: 'tree1',
						icon: 'rectangle'
					}],
					borderColor: '#c23531',
					textStyle: {
						fontSize: 20
					},
				},
				series: [{
					type: 'tree',

				  //name: 'tree1',
					data: [data1],
					top: '5%',
					left: '13%',
					bottom: '2%',
					right: '30%',

					symbolSize: 10,
					itemStyle: {

					},
					label: {
						normal: {
							position: 'left',
							verticalAlign: 'middle',
							align: 'right',
							fontSize:15
						},
					},

					leaves: {
						label: {
							normal: {
								position: 'right',
								verticalAlign: 'middle',
								align: 'left'
							}
						}
					},

					expandAndCollapse: true,

					animationDuration: 550,
					animationDurationUpdate: 750

				}]
			});
			if(option && typeof option === "object") {
				myChart.setOption(option, true);
			}
		}
	};
</script>
<style lang="css">
.download{
	margin-left: 60px;
}	
</style>
