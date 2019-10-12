<template>
	<div class="addJob">
		<el-form label-width="130px" size="small">
			<el-form-item>
				<el-button type="primary" @click="addRow(GuanZhi_Data)" class="margin-left10">新增</el-button>
				<el-button type="primary" @click="Save()">保存</el-button>
				<el-button type="primary" @click="PLadd()">批量添加官员</el-button>
				<el-button size="small" type="primary" @click="Select_GuanZhi()">官职名去重</el-button>
				<template>
					<el-table :data="GuanZhi_Data" class="tb-edit" style="width: 100%" highlight-current-row>
						<el-table-column label="ID" width="60" v-if="false">
							<template slot-scope="scope">
								<el-input size="small" v-model="scope.row.id" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input> <span>{{scope.row.id}}</span>
							</template>
						</el-table-column>
						<el-table-column label="官职名称" width="180">
							<template slot-scope="scope">
								<el-input size="small" v-model="scope.row.GuanZhi_MC" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input> <span>{{scope.row.GuanZhi_MC}}</span>
							</template>
						</el-table-column>
						<el-table-column label="描述" width="180">
							<template slot-scope="scope">
								<el-input size="small" v-model="scope.row.F_Caption" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input> <span>{{scope.row.F_Caption}}</span>
							</template>
						</el-table-column>
						<el-table-column label="品阶" width="200">
							<template slot-scope="scope">
								<el-input suffix-icon="el-icon-circle-plus" @click.native="open_Dialog(scope.$index, scope.row)" :option="option" v-model="scope.row.PinJie_FMC">
								</el-input>
								<span>{{scope.row.PinJie_FMC}}</span>
							</template>
						</el-table-column>
						<el-table-column label="所属部门" width="100">
							<template slot-scope="scope">
								<el-input suffix-icon="el-icon-circle-plus" @click.native="SSBM(scope.$index, scope.row)" v-model="scope.row.Belong">
								</el-input>
								<span>{{scope.row.Belong}}</span>
							</template>
						</el-table-column>
						</el-table-column>
						<el-table-column fixed="right" label="操作">
							<template slot-scope="scope">
								<el-button @click.native.prevent="deleteRow(scope.$index, GuanZhi_Data)" size="small"> 移除 </el-button>
							</template>
						</el-table-column>
						<el-table-column label="是否属于新增" width="150">
							<template slot-scope="scope">
								{{scope.row.isInsert}}
							</template>
						</el-table-column>
					</el-table>
				</template>
			</el-form-item>
		</el-form>

		<el-dialog title="批量添加官员" :visible.sync="editFormVisible" :close-on-click-modal="false" class="edit-form" :before-close="handleClose">
			<el-form :model="PLAdd_Data" label-width="80px" ref="editForm">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="官职名">
							<el-input auto-complete="off" v-model="PLAdd_Data.GuanZhiName"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="品阶">
							<div class="mdiv" style="margin-right:20px;top:5px;">
								<input type='text' id='sqr' class="input1" readonly="readonly" style="width:100px; height: 20px;" @click="selectPinJie"></input>
								<img  src="../assets/images/select.png" @click="selectPinJie()" style="cursor: pointer;width: 18px; height: 18px; position: relative; top: 8px;" />
							</div>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="描述">
					<el-input v-model="PLAdd_Data.F_Caption" auto-complete="off"></el-input>
				</el-form-item>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="部门">
							<el-input v-model="PLAdd_Data.Belong" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="人数">
							<el-input auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="handleCancel('editForm')">取消</el-button>
				<el-button type="primary" @click.native="handleUpdate('editForm')">保存</el-button>
			</div>
		</el-dialog>
		<el-dialog title="部门表" :visible.sync="GZBVisible" :close-on-click-modal="false" class="edit-form">
			<div class="GZB">
				<el-input placeholder="输入关键字进行过滤" v-model="GZB_filterText">
				</el-input>
				<el-tree class="filter-tree" :data="GZB_data" :props="defaultProps" :filter-node-method="GZB_filterNode" :check-strictly="true" show-checkbox highlight-current ref="Tree" @node-click="GZB_NodeClick" node-key="value" @check="GZB_checkGroupNode">
				</el-tree>
				<el-button type="primary" @click="GZB_Sure">确认</el-button>
				<el-button @click="GZBVisible=false">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	let vm;
	export default {
		computed: {

		},
		created() {

		},
		data() {
			return {
				//编辑界面数据
				editFormVisible: false, //默认不显示编辑弹层
				addnum: 0,
				GuanZhi_Data: [],
				GuanZhi_Orign_Data: [],
				GuanZhi_EditIndex: 0,

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
					GuanZhiName: '',
					PinJie_FBH: '',
					F_Caption: '',
					Belong: '',
				}
			};
		},
		mounted() {
			vm = this;
			axios.get(this.$store.state.MYURL + 'Select_GuanZhi.do', {
					params: {
						type: "2"
					}
				})
				.then(function(response) {
					vm.GuanZhi_Data = response.data;
					vm.GuanZhi_Orign_Data = JSON.parse(JSON.stringify(response.data));
					for(let i = 0; i < vm.GuanZhi_Data.length; i++) {
						vm.GuanZhi_Data[i].isInsert = false
					}
				})
				.catch(function(error) {
					console.log(error);
				});
		},
		methods: {
			Save() {
				let array = []
				debugger
				for(let i = 0; i < vm.GuanZhi_Orign_Data.length; i++) {
					for(let j in vm.GuanZhi_Orign_Data[i]) {
						if(vm.GuanZhi_Orign_Data[i][j] != vm.GuanZhi_Data[i][j]) {
							array.push(vm.GuanZhi_Data[i]);
						}
					}
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

				axios.post(this.$store.state.MYURL + 'InsertTableRow.do', {
						params: {
							tablename: 'guanzhi',
							values: array_insert_str,
							Insertcol: Insertcol,
						}
					})
					.then(function(response) {
						for(let i = 0; i < vm.GuanZhi_Data.length; i++) {
							vm.GuanZhi_Data[i].isInsert = false
						}
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			deleteRow(index, rows) { //删除改行
				rows.splice(index, 1);
			},
			addDialog(index, rows) { //打开弹出窗
			},
			addRow(GuanZhi_Data, event) {
				GuanZhi_Data.push({
					isInsert: true,
					PinJie_FBH: '',
					PinJie_FMC: '',
					Belong: '',
				})
				vm.GuanZhi_EditIndex = vm.GuanZhi_Data.length - 1
			},
			//
			//点击编辑
			handleEdit(index, row) {
				this.editForm = Object.assign({}, row); //这句是关键！！！
			},
			SSBM(index, row) {
				vm.GZB_data = []
				vm.GZBVisible = true
				vm.GuanZhi_EditIndex = index
				let option = {
					tablename: "dept",
					showcol: ['F_MC', 'F_BH', 'F_Parent'],
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
						for(let i = 0; i < response.data.length; i++) {
							if(response.data[i].F_Parent === "#") {
								vm.GZB_data.push({
									label: response.data[i].F_MC,
									value: response.data[i].F_BH,
									id: response.data[i].F_BH,
									children: []
								})
							}
						}
						for(let i = 0; i < response.data.length; i++) {
							for(let j = 0; j < vm.GZB_data.length; j++) {
								if(response.data[i].F_Parent == vm.GZB_data[j].value) {
									vm.GZB_data[j].children.push({
										label: response.data[i].F_MC,
										value: response.data[i].F_BH,
									})
								}
							}
						}
					})
					.catch(function(error) {
						console.log(error);
					});

			},
			GZB_filterNode(value, data) {
				if(!value) return true;
				return data.label.indexOf(value) !== -1;
			},
			GZB_NodeClick(data) {

			},
			GZB_Sure() {
				vm.GuanZhi_Data[vm.GuanZhi_EditIndex].Belong = vm.$refs.Tree.getCheckedNodes()[0].label
				vm.GZBVisible = false
			},
			GZB_checkGroupNode(a, b) {
				if(b.checkedKeys.length > 0) {
					this.$refs.Tree.setCheckedKeys([a.value]);
				}
			},
			PLadd(index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row); //这句是关键！！！
			},
			//点击关闭dialog
			handleClose(done) {
				this.editFormVisible = false;
			},

			//点击取消
			handleCancel(formName) {
				this.editFormVisible = false;
			},

			//点击更新
			handleUpdate(forName) {
				//更新的时候就把弹出来的表单中的数据写到要修改的表格中
				var postData = {
					name: this.editForm.name
				}

				//这里再向后台发个post请求重新渲染表格数据
				this.editFormVisible = false;
			},
			open_Dialog(index, row) { //告诉子组件
				//this.option.editShow = true;
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
			},
			Select_GuanZhi: function() {
				$.get(this.$store.state.MYURL + 'Select_GuanZhi.do', {
					type: "1"
				}, function(result) {
					vm.tableData = result;
					console.log(result);
				}, "json");
			},
			//官职表关闭函数
			GZBClose() {

			},
			//选择品阶
			selectPinJie() {
				//var f_comp_id = sqrgs.panSelect("getValue");
				$("#search2").panComSelect({
					width: "400px", //弹出框的宽度
					height: "500px", //弹出框的高度
					title: "选择用户",
					loadtext: "正在加载中...",
					url: sys_ctx + "/commonJsp/panDctChooser1.jsp?refdctid=SSF_USERS&refilter=true&opencontent=iframe&pagezindex=200",
					onlyfirst: true,
					dydata: {
						"grid_sqlWhere": "ZD.USR_USRID IN (select URO.F_USER_ID from BF_USER_ROLE_ORG URO where URO.F_COMP_ID = '" + f_comp_id + "' AND URO.F_ROLE_ID = 'R099') AND ZD.USR_DISABLE = '0' AND ZD.USR_TYPE = '1' "
					},
					parenturl: window.location.href,
					callback: function(data) {
						$("#sqr").val(data.rowData.USR_CAPTION + "(" + data.rowData.USR_USRID + ")");
						$("#sqr").data("sqrid", data.rowData.USR_USRID);
					}
				});
			},
		},
		computed: {
			sql_value() {
				return vm.$store.state.Dialog_Value;
			}
		},
		watch: {
			GZB_filterText(val) {
				this.$refs.Tree.filter(val);
			},
			'$store.state.Dialog_CallBack': function() {
				vm.GuanZhi_Data[vm.GuanZhi_EditIndex].PinJie_FMC = vm.$store.state.Dialog_CurrentData.F_MC
				vm.GuanZhi_Data[vm.GuanZhi_EditIndex].PinJie_FBH = vm.$store.state.Dialog_CurrentData.F_BH

			},
		}
	}
</script>
<style lang="less">
	.tb-edit .input-box {
		display: none
	}
	
	.tb-edit .current-cell .input-box {
		display: inline-block;
		margin-left: -15px;
	}
	
	.row-bg {
		padding: 5px 0;
	}
	
	.addJob {
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