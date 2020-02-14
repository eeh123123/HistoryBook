<template>
	<div class="cardManage">
		<div class="right">
			<el-input placeholder="输入关键字进行过滤" v-model="filterText">
			</el-input>
			<el-tree class="filter-tree" :data="data" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="tree">
			</el-tree>
		</div>
		<div class="left">
			<div class="top slotContent">
				<div>
					<span>厂站/线路：</span>
					<el-input placeholder="请您输入厂站/线路名称"></el-input>
				</div>
			</div>
			<div class="bottom"></div>
		</div>
	</div>
</template>

<script>
	//指标卡片管理
	export default {
		methods: {
			filterNode(value, data) {
				if(!value) return true;
				return data.label.indexOf(value) !== -1;
			}
		},

		data() {
			return {
				filterText: '',
				data: [{
					id: 1,
					label: '一级 1',
					children: [{
						id: 4,
						label: '二级 1-1',
						children: [{
							id: 9,
							label: '三级 1-1-1'
						}, {
							id: 10,
							label: '三级 1-1-2'
						}]
					}]
				}, {
					id: 2,
					label: '一级 2',
					children: [{
						id: 5,
						label: '二级 2-1'
					}, {
						id: 6,
						label: '二级 2-2'
					}]
				}],
				defaultProps: {
					children: 'children',
					label: 'label'
				}
			}
		},
		watch: {
			filterText(val) {
				this.$refs.tree.filter(val);
			}
		},

	}
</script>

<style lang="less">
	.cardManage {
		height: 100%;
		width: 100%;
		*{
			box-sizing: border-box;
		}
		.right {
			width: 16%;
			height: 100%;
			padding: 10px;
			float: left;
		}
		.left {
			width: 84%;
			height: 100%;
			float: left;
			.top {
				overflow: hidden;
			}
		}
	}
	
	.slotContentFloor2 {
		display: flex;
		flex-wrap: wrap;
		padding: 0 16px 8px 16px;
		>div {
			line-height: 40px;
			margin-right: 45px;
			margin-top: 8px;
		}
		.el-input {
			width: 200px;
		}
	}
</style>