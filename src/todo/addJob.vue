<template>
	<div class="addJob">
		<el-select v-model="query_Dept" clearable filterable class="margin-left10" placeholder="请选择部门" @change="searchs()">
			<el-option v-for="item in GZB_data_All" :key="item.id" :label="item.F_MC" :value="item.id">
			</el-option>
		</el-select>
		<div class="query-div">
			<el-input v-model="query_Content" placeholder="请输入官职名称"></el-input>
		</div>
		<el-button @click="searchs()" class="margin-left10" icon="el-icon-search" >搜索</el-button>
		<el-button @click="addRow(GuanZhi_Data)" class="margin-left10" icon="el-icon-circle-plus-outline">新增</el-button>
		<el-button @click="Save()" icon="el-icon-upload">保存</el-button>
		<el-button @click="KJ_add()">快捷添加官员</el-button>
		<el-button @click="PLadd()">批量添加官员</el-button>
		<el-button @click="Select_GuanZhi()">官职名去重</el-button>
		<template>
			<el-table :data="GuanZhi_Data" class="tb-edit" border style="width: 100%" height="calc(100% - 32px)" highlight-current-row>
				<el-table-column label="ID" width="60" v-if="false">
					<template slot-scope="scope">
						<el-input v-model="scope.row.id" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input> <span>{{scope.row.id}}</span>
					</template>
				</el-table-column>
				<el-table-column label="官职名称" width="180">
					<template slot-scope="scope">
						<el-input v-model="scope.row.GuanZhi_MC" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input> <span>{{scope.row.GuanZhi_MC}}</span>
					</template>
				</el-table-column>
				<el-table-column label="描述" width="180">
					<template slot-scope="scope">
						<el-input v-model="scope.row.F_Caption" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input> <span>{{scope.row.F_Caption}}</span>
					</template>
				</el-table-column>
				<el-table-column label="品阶" width="200">
					<template slot-scope="scope">
						<el-input suffix-icon="el-icon-circle-plus" @click.native="open_Dialog(scope.$index, scope.row)" :option="option" v-model="scope.row.PinJie_FMC">
						</el-input>
						<span>{{scope.row.PinJie_FMC}}</span>
					</template>
				</el-table-column>
				<el-table-column label="上级官员" width="200">
					<template slot-scope="scope">
						<el-input suffix-icon="el-icon-circle-plus" @click.native="open_DialogGuanZhi(scope.$index, scope.row)" :option="option" v-model="scope.row.fatherid">
						</el-input>
						<span>{{scope.row.fatherid_FMC}}</span>
					</template>
				</el-table-column>
				<el-table-column label="所属部门" width="100">
					<template slot-scope="scope">
						<el-input suffix-icon="el-icon-circle-plus" @click.native="SSBM(scope.$index, scope.row,0)" v-model="scope.row.Belong">
						</el-input>
						<span>{{scope.row.Belong}}</span>
					</template>
				</el-table-column>
			</el-table>
		</template>

		<el-dialog title="批量添加官员" :visible.sync="editFormVisible" :close-on-click-modal="false" :before-close="handleClose">
			<el-form :model="PLAdd_Data" label-width="80px" ref="editForm">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="官职名*">
							<el-input auto-complete="off" v-model="PLAdd_Data.GuanZhi_MC"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="品阶*">
							<div class="mdiv" style="margin-right:20px;top:5px;">
								<el-input suffix-icon="el-icon-circle-plus" @click.native="open_Dialog1()" :option="option" v-model="PLAdd_Data.PinJie_FMC">
								</el-input>
							</div>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="描述">
					<el-input v-model="PLAdd_Data.F_Caption" auto-complete="off"></el-input>
				</el-form-item>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="部门*">
							<el-input suffix-icon="el-icon-circle-plus" @click.native="SSBM()" v-model="PLAdd_Data.Belong">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="人数*">
							<el-input auto-complete="off" v-model="PLAdd_Data.Count"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="handleCancel()">取消</el-button>
				<el-button type="primary" @click.native="PLSave()">保存</el-button>
			</div>
		</el-dialog>
		<el-dialog title="快捷添加官员" :visible.sync="KJFormVisible" :close-on-click-modal="false" v-dialogDrag>
			<el-input suffix-icon="el-icon-circle-plus" @click.native="SSBM('KJ')" v-model="KJ_GuanZhi" class="width-40"></el-input>
			<el-input v-model="KJ_FirstName" placeholder="请输入前缀名" class="margin-bottom10 width-40"></el-input>
			<textarea autocomplete="off" class="el-textarea__inner margin-bottom10" rows="12" style="min-height: 33px;" v-model="KJ_Caption">{{KJ_Caption}</textarea>
			<el-button type="primary" @click="KJ_Read">读取</el-button>
		</el-dialog>
		<el-dialog title="部门表" :visible.sync="GZBVisible" :close-on-click-modal="false" v-dialogDrag>
			<div class="GZB">
				<el-input placeholder="输入关键字进行过滤" v-model="GZB_filterText">
				</el-input>
				<el-tree class="filter-tree" :data="GZB_data" :props="defaultProps" :filter-node-method="GZB_filterNode" :check-strictly="true" show-checkbox highlight-current ref="Tree" @node-click="GZB_NodeClick" node-key="value" @check="GZB_checkGroupNode">
				</el-tree>
				<el-button type="primary" @click="GZB_Sure">确认</el-button>
				<el-button @click="GZBVisible=false">取消</el-button>
			</div>
		</el-dialog>
		<EditDialog ref="edit_dialog" :visible.sync="Dialog_show" :title="Dialog_title" :handleCurrentChange="handleCurrentChange" :handleSizeChange="handleSizeChange" :callBack="cbFunc" :tableHead="tableHead" :tableData.sync="Dialog_data"></EditDialog>
	</div>
</template>

<script>
	import EditDialog from '../tools/EditDialog.vue'
	const mapState = Vuex.mapState;
	let vm;

	export default {
		computed: Object.assign({},
			mapState({
				Dialog_show: 'Dialog_show',
				Dialog_data: 'Dialog_data',
				Dialog_title: 'Dialog_title'
			})
		),
		components: {
			EditDialog
		},
		data() {
			return {
				//查询数据
				query_Dept: "",
				query_Content: "",
				GZB_data_All: [],
				//编辑界面数据
				editFormVisible: false, //默认不显示编辑弹层
				KJFormVisible: false, //默认不显示快捷添加官职图层
				KJ_FirstName: "",
				KJ_GuanZhi: "",
				KJ_Caption: "",
				GuanZhi_Data: [],
				GuanZhi_Orign_Data: [],
				GuanZhi_EditIndex: 0,
				cbFunc: function() {},
				option: {
					showcol: [{
						F_MC: '名称',
						F_BH: '编号'
					}],
					table: "GuanZhi",
					sqlwhere: "",
					editShow: false
				},
				GZBVisible: false,
				GZB_data: [],
				GZB_filterText: '',
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				PLAdd_Data: {
					GuanZhi_MC: '',
					PinJie_FBH: '',
					PinJie_FMC: '',
					F_Caption: '',
					Belong: '',
					Count: '',
				},
				GuanZhiType: 0,
				tableHead: [{
					code: "F_MC",
					label: "名称"
				}, {
					code: "id",
					label: "编号"
				}],
				currentPage: 1
			};
		},
		mounted() {
			vm = this;
			//vm.queryTableData();
			vm.query_GZB_data_All();
		},
		methods: {
			//查询所有部门
			query_GZB_data_All() {
				let option = {
					tablename: "dept",
					showcol: ['F_MC', 'id', 'F_Parent'],
					sqlwhere: "1=1 AND Dynasty = '唐'"
				}
				axios.get(this.$store.state.MYURL + 'QueryTableRow.do', {
						params: {
							tablename: option.tablename,
							showcol: option.showcol.join(","),
							sqlwhere: option.sqlwhere
						}
					})
					.then(function(response) {
						vm.GZB_data_All = response.data.data;
					})
			},
			searchs() {
				let option = {
					tablename: "GuanZhi",
					sqlwhere: "1=1"
				}
				if(vm.query_Dept) {
					option.sqlwhere += " AND Belong ='" + vm.query_Dept + "'";
				}
				if(vm.query_Content) {
					option.sqlwhere += " AND GuanZhi_MC LIKE '%" + vm.query_Content + "%'";
				}
				axios.get(this.$store.state.MYURL + 'QueryTableRow.do', {
						params: {
							tablename: option.tablename,
							showcol: "*",
							sqlwhere: option.sqlwhere + " Order By Belong,(PinJie+0) ,ID"
						}
					})
					.then(function(response) {
						vm.GuanZhi_Data = response.data.data;
						vm.GuanZhi_Orign_Data = JSON.parse(JSON.stringify(response.data.data));
						for(let i = 0; i < vm.GuanZhi_Data.length; i++) {
							vm.GuanZhi_Data[i].isInsert = false
						}
					})
			},
			//查询官职
			queryTableData() {
				let option = {
					tablename: "GuanZhi",
					sqlwhere: "1=1 Order By Belong,(PinJie+0) ,ID"
				}
				axios.get(this.$store.state.MYURL + 'QueryTableRow.do', {
						params: {
							tablename: option.tablename,
							showcol: "*",
							sqlwhere: option.sqlwhere
						}
					})
					.then(function(response) {
						vm.GuanZhi_Data = response.data.data;
						vm.GuanZhi_Orign_Data = JSON.parse(JSON.stringify(response.data.data));
						for(let i = 0; i < vm.GuanZhi_Data.length; i++) {
							vm.GuanZhi_Data[i].isInsert = false
						}
					})
			},
			Save() {
				let update_flag = true;
				let array_update = []
				let array_update_str = []
				for(let i = 0; i < vm.GuanZhi_Orign_Data.length; i++) {
					for(let j in vm.GuanZhi_Orign_Data[i]) {
						if(vm.GuanZhi_Orign_Data[i][j] != vm.GuanZhi_Data[i][j]) {
							for(let k = 0; k < array_update.length; k++) {
								if(array_update[k].id == vm.GuanZhi_Data[i].id) {
									update_flag = false
								}
							}
							if(update_flag == true) {
								array_update.push({
									id: vm.GuanZhi_Data[i].id
								})
							}

							//上面这个for循环和if是为了判断需不需要新增id

							for(let k = 0; k < array_update.length; k++) {
								if(array_update[k].id == vm.GuanZhi_Data[i].id) {
									array_update[k][j] = vm.GuanZhi_Data[i][j]
								}
							}
							update_flag = true;
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
							for(let i = 0; i < vm.GuanZhi_Data.length; i++) {
								vm.GuanZhi_Data[i].isInsert = false
							}
							vm.$message({
								type: 'success',
								message: response.data.msg
							});
						})
				}

				let array_insert = []
				let array_insert_str = []
				for(let i = 0; i < vm.GuanZhi_Data.length; i++) {
					if(vm.GuanZhi_Data[i].isInsert === true) {
						array_insert.push(vm.GuanZhi_Data[i])
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
								tablename: 'guanzhi',
								values: array_insert_str,
								Insertcol: Insertcol,
							}
						})
						.then(function(response) {
							if(response.data.rows != -1) {
								for(let i = 0; i < vm.GuanZhi_Data.length; i++) {
									vm.GuanZhi_Data[i].isInsert = false
								}
								vm.$message({
									type: 'success',
									message: response.data.msg
								});
							} else {
								vm.$message({
									type: 'error',
									message: response.data.msg
								});
							}

						})
				}
			},
			addRow(GuanZhi_Data) {
				if(GuanZhi_Data.length > 0) {
					GuanZhi_Data.push({
						isInsert: true,
						PinJie_FBH: '',
						PinJie_FMC: '',
						F_Caption: '',
						Belong: GuanZhi_Data[GuanZhi_Data.length - 1].Belong,
					})
				} else {
					GuanZhi_Data.push({
						isInsert: true,
						PinJie_FBH: '',
						PinJie_FMC: '',
						F_Caption: '',
						Belong: '',
					})
				}
				vm.GuanZhi_EditIndex = vm.GuanZhi_Data.length - 1
			},
			//
			//点击编辑
			handleEdit(index, row) {
				this.editForm = Object.assign({}, row); //这句是关键！！！
			},
			SSBM(index, row, type) {
				vm.GZB_data = []
				vm.GZBVisible = true
				vm.GZB_filterText = '' //每次打开官职表时，置空查询条件
				if(type == 0) {
					vm.GuanZhiType = 0;
					vm.GuanZhi_EditIndex = index || 0
				}
				if(index == undefined) {
					vm.GuanZhiType = 1;
				} else if(index == "KJ") {
					vm.GuanZhiType = 2;
				}
				let option = {
					tablename: "dept",
					showcol: ['F_MC', 'id', 'F_Parent'],
					sqlwhere: "1=1 AND Dynasty = '唐'"
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
							if(response.data.data[i].F_Parent === "#") {
								vm.GZB_data.push({
									label: response.data.data[i].F_MC,
									value: response.data.data[i].id,
									id: response.data.data[i].id,
									children: []
								})
							}
						}
						for(let i = 0; i < response.data.data.length; i++) {
							for(let j = 0; j < vm.GZB_data.length; j++) {
								if(response.data.data[i].F_Parent == vm.GZB_data[j].value) {
									vm.GZB_data[j].children.push({
										label: response.data.data[i].F_MC,
										value: response.data.data[i].id,
									})
								}
							}
						}
					})
			},
			GZB_filterNode(value, data) {
				if(!value) return true;
				return data.label.indexOf(value) !== -1;
			},
			GZB_NodeClick(data) {

			},
			GZB_Sure() {
				if(vm.GuanZhiType == 0) {
					vm.GuanZhi_Data[vm.GuanZhi_EditIndex].Belong = vm.$refs.Tree.getCheckedNodes()[0].value
				} else if(vm.GuanZhiType == 1) {
					vm.PLAdd_Data.Belong = vm.$refs.Tree.getCheckedNodes()[0].value
				} else if(vm.GuanZhiType == 2) {
					vm.KJ_GuanZhi = vm.$refs.Tree.getCheckedNodes()[0].value
				}
				vm.GZBVisible = false
			},
			GZB_checkGroupNode(a, b) {
				if(b.checkedKeys.length > 0) {
					this.$refs.Tree.setCheckedKeys([a.value]);
				}
			},
			PLadd(index, row) {
				this.editFormVisibKJFormVisiblele = true;
				this.editForm = Object.assign({}, row); //这句是关键！！！
			},
			//快捷添加官员方法
			KJ_add() {
				vm.KJFormVisible = true;
			},
			KJ_Read() {
				vm.KJ_FirstName
				vm.KJ_Caption = vm.KJ_Caption.replace("　　", "　");
				vm.KJ_Caption = vm.KJ_Caption.replace(/[\r\n]/g, "");
				let Number_Array = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"]
				let array = vm.KJ_Caption.split("　");
				let values = []
				let index = 0
				for(let i = 0; i < array.length; i++) {
					if(array[i] == "") {
						array.splice(i, 1)
					}
					array[i] = array[i].replace(/\s*/g, "");
					array[i] = array[i].replace("人", "");
				}
				for(let i = 0; i < array.length; i++) {
					//找到array[i]中的数字下标
					for(let j = 0; j < Number_Array.length; j++) {
						if(array[i].indexOf(Number_Array[j]) != -1) {
							index = array[i].indexOf(Number_Array[j])
							values[i] = ["",  vm.KJ_FirstName + array[i].substr(0, index), this.$tools.ChineseToNumber(array[i].substr(index)), vm.KJ_GuanZhi];
							break;
						}
					}
				}

				axios.post(this.$store.state.MYURL + 'InsertTableRow_Origin.do', {
						params: {
							tablename: "GuanZhi",
							Insertcol: "PinJie,GuanZhi_MC,personSize,Belong",
							values: values
						}
					})
					.then(function(response) {
						vm.$message({
							type: 'success',
							message: response.data.msg
						});
						vm.searchs();
					})
			},
			//点击关闭dialog
			handleClose(done) {
				this.editFormVisible = false;
			},

			//点击取消
			handleCancel(formName) {
				vm.PLAdd_Data = [];
				vm.editFormVisible = false;
			},

			//批量保存
			PLSave() {
				let senddata = JSON.parse(JSON.stringify(vm.PLAdd_Data));
				let value = []
				for(let i = 0; i < vm.PLAdd_Data.Count; i++) {
					value.push(
						[vm.PLAdd_Data.PinJie,
							vm.PLAdd_Data.GuanZhi_MC + "(" + (i - 1 + 2) + ")",
							vm.PLAdd_Data.F_Caption,
							vm.PLAdd_Data.Belong
						]
					)
				}
				axios.post(this.$store.state.MYURL + 'InsertTableRow.do', {
						params: {
							tablename: "GuanZhi",
							Insertcol: "PinJie,GuanZhi_MC,F_Caption,Belong",
							values: value
						}
					})
					.then(function(response) {
						vm.$message({
							type: 'success',
							message: response.data.msg
						});
						vm.queryTableData();
					})
					.catch(function(error) {
						console.log(error);
					});
				this.editFormVisible = false;
			},
			open_Dialog(index, row) { //告诉子组件
				vm.GuanZhi_EditIndex = index
				let option = {
					tablename: "PinJie",
					showcol: ['F_MC', 'F_BH'],
					sqlwhere: "1=1 Limit 0,10"
				};
				vm.$store.commit("setCol_Name", [{
					F_BH: '编号',
					F_MC: '名称'
				}]);
				vm.$store.commit("setTitle", "品阶表");
				vm.$store.commit("query_Dialog_data", option);
				vm.$store.commit('setshow', true);
				vm.$refs.edit_dialog.currentPage = 1;
				vm.cbFunc = function(data) {
					vm.GuanZhi_Data[vm.GuanZhi_EditIndex].PinJie_FMC = data.F_MC
					vm.GuanZhi_Data[vm.GuanZhi_EditIndex].PinJie_FBH = data.F_BH
				}
			},
			open_DialogGuanZhi(index, row){
				vm.GuanZhi_EditIndex = index
				let option = {
					tablename: "GuanZhi",
					showcol: ['GuanZhi_MC', 'id'],
					sqlwhere: "1=1 Limit 0,10"
				};
				vm.$store.commit("setCol_Name", [{
					GuanZhi_MC: '名称',
					id: '编号'
				}]);
				vm.tableHead=[{
					code: "GuanZhi_MC",
					label: "名称"
				}, {
					code: "id",
					label: "编号"
				}],
				vm.$store.commit("setTitle", "官职表");
				vm.$store.commit("query_Dialog_data", option);
				vm.$store.commit('setshow', true);
				vm.$refs.edit_dialog.currentPage = 1;
				vm.cbFunc = function(data) {
					vm.GuanZhi_Data[vm.GuanZhi_EditIndex].father_id_FMC = data.GuanZhi_MC
					vm.GuanZhi_Data[vm.GuanZhi_EditIndex].father_id_FBH = data.id
				}
			},
			open_Dialog1(index, row) { //告诉子组件
				vm.GuanZhi_EditIndex = index
				let option = {
					tablename: "PinJie",
					showcol: ['F_MC', 'F_BH'],
					sqlwhere: "1=1 Limit 0,10"
				};
				vm.$store.commit("setCol_Name", [{
					F_BH: '编号',
					F_MC: '名称'
				}]);
				vm.$store.commit("setTitle", "品阶表");
				vm.$store.commit("query_Dialog_data", option);
				vm.$refs.edit_dialog.currentPage = 1;
				vm.$store.commit('setshow', true);
				vm.cbFunc = function(data) {
					vm.PLAdd_Data.PinJie_FMC = data.F_MC
					vm.PLAdd_Data.PinJie_FBH = data.F_BH
				}
			},
			Select_GuanZhi: function() {
				$.get(this.$store.state.MYURL + 'Select_GuanZhi.do', {
					type: "1"
				}, function(result) {
					vm.GuanZhi_Data = result;
					vm.GuanZhi_Orign_Data = JSON.parse(JSON.stringify(result));
				}, "json");
			},
			handleCurrentChange(row) {
				let option = {
					tablename: "PinJie",
					showcol: ['F_MC', 'F_BH'],
					sqlwhere: "1=1 Limit " + (row - 1) * 10 + ",10"
				};
				vm.$store.commit("query_Dialog_data", option);
			},
			handleSizeChange(a, b, c) {},
		},
		watch: {
			GZB_filterText(val) {
				this.$refs.Tree.filter(val);
			}
		}
	}
</script>
<style lang="less">
	.addJob {
		height: 100%;
		.query-div {
			width: 200px;
			display: inline-block;
		}
		.el-dialog {
			width: 400px;
		}
		.el-table td,
		.el-table th {
			padding: 6px 0;
		}
		.el-input--small .el-input__inner {
			height: 28px;
			line-height: 28px;
		}
		.el-input--small .el-input__icon {
			line-height: 28px;
		}
	}
</style>
