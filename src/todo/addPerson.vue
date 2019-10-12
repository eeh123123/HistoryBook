<template>
	<el-table :data="tableData" class="tb-edit" style="width: 100%" highlight-current-row @row-click="handleCurrentChange">
		<el-table-column label="日期" width="180">
			<template slot-scope="scope">
				<el-input size="small" v-model="scope.row.date" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input> <span>{{scope.row.date}}</span>
			</template>
		</el-table-column>
		<el-table-column label="姓名" width="180">
			<template slot-scope="scope">
				<el-input size="small" v-model="scope.row.name" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input> <span>{{scope.row.name}}</span>
			</template>
		</el-table-column>
		<el-table-column prop="address" label="地址">
			<template slot-scope="scope">
				<el-input size="small" v-model="scope.row.address" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input> <span>{{scope.row.address}}</span>
			</template>
		</el-table-column>
		<el-table-column label="操作">
			<template slot-scope="scope">
				<!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
				<el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
			</template>
		</el-table-column>
	</el-table>
</template>

<script>
	export default {
		data() {
			return {
				tableData: [{
					date: '2016-05-02',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄'
				}, {
					date: '2016-05-04',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1517 弄'
				}, {
					date: '2016-05-01',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1519 弄'
				}, {
					date: '2016-05-03',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1516 弄'
				}]
			}
		},
		methods: {
			handleCurrentChange: function(row, event, column) {
				console.log(row, event, column, event.currentTarget);
			},
			handleEdit: function(index, row) {
				console.log(index, row);
			},
			handleDelete: function(index, row) {
				console.log(index, row);
			}
		}
	}
</script>

<style lang="css">
	.tb-edit .el-input {
		display: none
	}
	
	.tb-edit .current-row .el-input {
		display: block
	}
	
	.tb-edit .current-row .el-input+span {
		display: none
	}
</style>