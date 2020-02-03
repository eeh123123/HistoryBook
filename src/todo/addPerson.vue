<template>
	<div class="addPerson">
		<el-button type="primary" @click="addRow()" class="margin-left10" size="small">新增</el-button>
		<el-button type="primary" @click="Save()" size="small">保存</el-button>
		<template>
			<el-table :data="tableData" class="tb-edit" height="calc(100% - 32px)" border highlight-current-row @row-click="handleCurrentChange">
				<el-table-column label="姓名" width="180">
					<template slot-scope="scope">
						<el-input v-model="scope.row.person_name" placeholder="请输入内容"></el-input> <span>{{scope.row.person_name}}</span>
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
						<el-input v-model="scope.row.born_position" placeholder="请输入内容" @click.native="Open_Position(scope.$index, scope.row)" suffix-icon="el-icon-circle-plus"></el-input> <span>{{scope.row.born_position}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="address" label="描述" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<el-input v-model="scope.row.f_caption" placeholder="请输入内容"></el-input> <span>{{scope.row.f_caption}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="address" label="立绘">
					<template slot-scope="scope">
						<img :src="scope.row.imgURL" @click="openImg(scope.$index,scope.row.imgURL,imgURL)" style="vertical-align: middle;height:40px;width: 40px" />
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="danger" @click="deleteRow(scope.$index)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</template>
		<el-dialog title="地区表" :visible.sync="DQVisible" :close-on-click-modal="false" v-dialogDrag custom-class="dialog-DQ">
			<el-input v-model="DQ_Content" placeholder="请输入地区" class="margin-bottom10"></el-input>
			<!--树形图-->
			<el-tree :props="props" :load="loadNode" lazy class="new-tree margin-bottom10" @node-click="node_click" style="max-height: 400px;overflow-y: scroll;">
			</el-tree>
			<el-button type="primary" @click="DQ_Sure()">确定</el-button>
		</el-dialog>
		<el-dialog title="立绘表" :visible.sync="Img.Visible" :close-on-click-modal="false" v-dialogDrag custom-class="dialog-Image">
			<el-upload class="avatar-uploader" :action="Img.action" :show-file-list="false" :on-success="handleAvatarSuccess">
				<img v-if="Img.Url" :src="Img.Url" class="person-Image">
				<i v-else class="el-icon-plus avatar-uploader-icon"></i>
			</el-upload>
		</el-dialog>
	</div>
</template>

<script>
	let vm = ''
	export default {
		data() {
			return {
				tableData: [],
				tableData_Orign_Data: [],
				EditIndex: "",
				contentId: "",
				DQ_born_position: '',
				DQVisible: false,
				DQ_Content: "",
				props: {
					label: 'PROVINCE',
					children: 'zones',
					isLeaf: 'leaf'
				},
				Img: {
					Visible: false,
					Url: '',
					action: ''
				}
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
					showcol: ['imgURL', 'id', 'person_name', 'born_date', 'born_position', 'death_date', 'f_caption'],
					sqlwhere: "1=1 ORDER BY CONVERT(PERSON_NAME USING GBK) COLLATE GBK_CHINESE_CI ASC"
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
						vm.tableData_Orign_Data = JSON.parse(JSON.stringify(response.data.data));
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
			deleteRow(index) { //删除改行
				vm.tableData.splice(index, 1);
			},
			Open_Position(index, row) {
				vm.EditIndex = index || 0
				vm.DQVisible = true
			},
			loadNode(node, resolve, type, value) {
				if(node.level === 0) {
					vm.node_had = node; //这里是关键！在data里面定义一个变量，将node.level == 0的node存起来
					vm.resolve_had = resolve; //同上，把node.level == 0的resolve也存起来
					let option = {
						tablename: "PROVINCES",
						showcol: ['ID', 'PROVINCEID', 'PROVINCE'],
						sqlwhere: "1=1 "
					}
					axios.get(this.$store.state.MYURL + 'QueryTableRow.do', {
							params: {
								tablename: option.tablename,
								showcol: option.showcol.join(","),
								sqlwhere: option.sqlwhere
							}
						})
						.then(function(response) {
							resolve(response.data.data);

						})
						.catch(function(error) {
							console.log(error);
						});
				} else if(node.level === 1) {
					let option = {
						tablename: "CITIES",
						showcol: ['*'],
					}
					if(type == "custom") {
						option.sqlwhere = "1=1 AND CITY LIKE '%" + value + "%'";
					} else {
						option.sqlwhere = "1=1 AND PROVINCEID='" + node.data.PROVINCEID + "'";
					}

					axios.get(this.$store.state.MYURL + 'QueryTableRow.do', {
							params: {
								tablename: option.tablename,
								showcol: option.showcol.join(","),
								sqlwhere: option.sqlwhere
							}
						})
						.then(function(response) {
							for(let i = 0; i < response.data.data.length; i++) {
								response.data.data[i]["PROVINCE"] = response.data.data[i]["city"]
							}
							resolve(response.data.data);
						})
						.catch(function(error) {
							console.log(error);
						});
				} else {
					return resolve([]);
				}
			},
			node_click(a, b, c) {
				vm.DQ_born_position = a.city
			},
			DQ_Sure() {
				vm.tableData[vm.EditIndex].born_position = vm.DQ_born_position
				vm.DQVisible = false;
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
								tablename: 'person',
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
				}
			},
			handleAvatarSuccess(res, file) {
				vm.Img.Url = vm.$store.state.FWQURL + "upload/" + res.filename
				let array_update = [{
					id: vm.contentId,
					imgUrl: vm.Img.Url
				}]
				axios.post(this.$store.state.MYURL + 'UpdateTableRow.do', {
						params: {
							tablename: 'person',
							values: array_update,
						}
					})
					.then(function(response) {
						vm.tableData[vm.contentId].imgUrl = vm.Img.Url
						vm.$message({
							type: 'success',
							message: response.data.msg
						});
					})
			},
			openImg(index, val) {
				vm.contentId = vm.tableData[index].id
				vm.Img.Visible = true
				vm.Img.Url = val
				vm.Img.action = vm.$store.state.FWQURL + "up"
			}
		},
		watch: {
			DQ_Content(val) {
				if(val) {
					vm.node_had.level = 1;
				} else {
					vm.node_had.level = 0;
				}
				vm.node_had.childNodes = []; //把存起来的node的子节点清空，不然会界面会出现重复树！
				vm.loadNode(vm.node_had, vm.resolve_had, 'custom', val); //再次执行懒加载的方法
			}
		}
	}
</script>
<style lang="less">
	.addPerson {
		height: 100%;
		.el-form-item,
		.el-form-item__content {
			height: 100%;
		}
		.dialog-DQ {
			width: 400px;
		}
		.dialog-Image {
			width: 600px;
			height: 400px;
		}
		.person-Image {
			width: auto;
			height: 282px;
			max-width: 100%;
			max-height: 100%;
		}
	}
</style>
