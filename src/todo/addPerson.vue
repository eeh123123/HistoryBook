<template>
	<el-form label-width="130px" size="small">
		<el-form-item>
			<el-button type="primary" @click="addRow()" class="margin-left10">新增</el-button>
			<el-button type="primary" @click="Save()">保存</el-button>
			<template>
				<el-table :data="tableData" class="tb-edit" style="width: 100%" highlight-current-row @row-click="handleCurrentChange">
					<el-table-column label="姓名" width="180">
						<template slot-scope="scope">
							<el-input size="small" v-model="scope.row.person_name" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input> <span>{{scope.row.person_name}}</span>
						</template>
					</el-table-column>
					<el-table-column label="出生日期" width="180">
						<template slot-scope="scope">
							<el-date-picker v-model="scope.row.born_date" type="date" placeholder="选择日期" editable value-format="yyyy-MM-dd">
							</el-date-picker><span>{{scope.row.born_date}}</span>
						</template>
					</el-table-column>
					<el-table-column label="死亡日期" width="180">
						<template slot-scope="scope">
							<el-date-picker v-model="scope.row.death_date" type="date" placeholder="选择日期" editable value-format="yyyy-MM-dd">
							</el-date-picker><span>{{scope.row.death_date}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="address" label="出生地">
						<template slot-scope="scope">
							<el-input size="small" v-model="scope.row.born_position" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input> <span>{{scope.row.born_position}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="address" label="立绘">
						<template slot-scope="scope">
							<el-input size="small" v-model="scope.row.imgURL" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input> <span>{{scope.row.imgURL}}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button size="small" type="danger" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</template>
		</el-form-item>
	</el-form>
</template>

<script>
	let vm = ''
	export default {
		data() {
			return {
				tableData: [],
				tableData_Orign_Data: [],

			}
		},
		mounted() {
			vm = this;
			this.queryTableData();
		},
		methods: {
			queryTableData() {
				let option = {
					tablename: "Person",
					showcol: ['imgURL','ID','person_name', 'born_date', 'born_position','death_date'],
					sqlwhere: "1=1"
				}
				axios.get(this.$store.state.MYURL + 'QueryTableRow.do', {
						params: {
							tablename: option.tablename,
							showcol: option.showcol.join(","),
							sqlwhere: option.sqlwhere
						}
					})
					.then(function(response) {
						vm.tableData = response.data.data;
						vm.tableData_Orign_Data = JSON.parse(JSON.stringify(response.data));
						for(let i = 0; i < vm.tableData.length; i++) {
							vm.tableData[i].isInsert = false
						}
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			addRow() {
				vm.tableData.push({
					isInsert: true,
					person_name: '',
					born_date: '',
					born_position: '',
					death_date: ''
				})
			},
			handleCurrentChange: function(row, event, column) {
				console.log(row, event, column, event.currentTarget);
			},
			handleEdit: function(index, row) {
				console.log(index, row);
			},
			deleteRow(index, rows) { //删除改行
				rows.splice(index, 1);
			},
			Save() {
				let insert_flag = true;
				let array_update = []
				let array_update_str = []
				for(let i = 0; i < vm.tableData_Orign_Data.length; i++) {
					for(let j in vm.tableData_Orign_Data[i]) {
						if(vm.tableData_Orign_Data[i][j] != vm.tableData[i][j]) {
							
							for(let k = 0; k < array_update.length; k++) {
								if(array_update[k].id == vm.tableData[i].id) {
									insert_flag = false
								}
							}
							if(insert_flag == true) {
								array_update.push({
									id: vm.tableData[i].id
								})
							}

							//上面这个for循环和if是为了判断需不需要新增id

							for(let k = 0; k < array_update.length; k++) {
								if(array_update[k].id == vm.tableData[i].id) {
									array_update[k][j] = vm.tableData[i][j]
								}
							}
						}
					}
				}

				if(array_update.length != 0) {
					axios.post(this.$store.state.MYURL + 'UpdateTableRow.do', {
							params: {
								tablename: 'guanzhi',
								values: array_update,
							}
						})
						.then(function(response) {
							for(let i = 0; i < vm.tableData.length; i++) {
								vm.tableData[i].isInsert = false
							}
							vm.$message({
								type: 'success',
								message: response.data.msg
							});
						})
						.catch(function(error) {
							console.log(error);
						});
				}

				let array_insert = []
				let array_insert_str = []
				for(let i = 0; i < vm.tableData.length; i++) {
					if(vm.tableData[i].isInsert === true) {
						array_insert.push(vm.tableData[i])
					}
				}
				array_insert = JSON.parse(JSON.stringify(array_insert));

				for(let i = 0; i < array_insert.length; i++) {
					delete array_insert[i].isInsert
					array_insert_str[i] = [] //初始化这个数组
				}
				let Insertcol = ""
				for(let i in array_insert[0]) {
					Insertcol += (i + ",")
				}

				for(let i = 0; i < array_insert.length; i++) {
					for(let j in array_insert[i]) {
						if(array_insert_str[i] === undefined) {
							array_insert_str[i] = []
						}
						if(array_insert[i][j] == "") {
							array_insert_str[i].push("")
						} else {
							array_insert_str[i].push(array_insert[i][j])
						}
					}
				}
				Insertcol = Insertcol.substring(0, Insertcol.length - 1)

				if(array_insert.length != 0) {
					axios.post(this.$store.state.MYURL + 'InsertTableRow.do', {
							params: {
								tablename: 'person',
								values: array_insert_str,
								Insertcol: Insertcol,
							}
						})
						.then(function(response) {
							for(let i = 0; i < vm.tableData.length; i++) {
								vm.tableData[i].isInsert = false
							}
							vm.$message({
								type: 'success',
								message: response.data.msg
							});
						})
						.catch(function(error) {
							console.log(error);
						});
				}
			},
		}
	}
</script>

<style lang="css" scoped="scoped">

</style>