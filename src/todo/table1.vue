<template>
	<div>
		<el-form label-width="130px" size="small">
			<el-form-item>
				<el-button type="primary" @click="addRow(GuanZhi_Data)">新增</el-button>
				<el-button type="primary" @click="Save()">保存</el-button>
				<el-button type="primary" @click="PLadd()">批量添加官员</el-button>
				<el-button size="small" type="primary" @click="Select_GuanZhi()">官职名去重</el-button>
				<template>
					<el-table :data="GuanZhi_Data" class="tb-edit" style="width: 100%" highlight-current-row>
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
								<sql-input :value="scope.row.PinJie" @click.native="open_Dialog()" :option="option"></sql-input>
								</span>
							</template>
						</el-table-column>
						<el-table-column label="所属部门" width="100">
							<template slot-scope="scope">
								<el-input size="small" v-model="scope.row.Belong" placeholder="" @change="handleEdit(scope.$index, scope.row)"></el-input> <span>{{scope.row.Belong}}</span>
							</template>
						</el-table-column>
						</el-table-column>
						<el-table-column fixed="right" label="操作">
							<template slot-scope="scope">
								<el-button @click.native.prevent="deleteRow(scope.$index, GuanZhi_Data)" size="small"> 移除 </el-button>
							</template>
						</el-table-column>
					</el-table>
				</template>
			</el-form-item>
		</el-form>

		<el-dialog title="批量添加官员" :visible.sync="editFormVisible" :close-on-click-modal="false" class="edit-form" :before-close="handleClose">
			<el-form :model="GuanZhi_Data" label-width="80px" ref="editForm">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="官职名" prop="Name">
							<el-input auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="品阶" prop="Name">
							<sql-input :type="'old'" :showcol="[{F_MC:'名称',F_BH:'编号'}]" :sql="'SELECT * FROM GUANZHI'" :window_name="'null'"></sql-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="描述" prop="Name">
					<el-input v-model="GuanZhi_Data.F_Caption" auto-complete="off"></el-input>
				</el-form-item>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="部门" prop="Name">
							<el-input v-model="GuanZhi_Data.Belong" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="人数" prop="Name">
							<el-input auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="handleCancel('editForm')">取消</el-button>
				<el-button type="primary" @click.native="handleUpdate('editForm')">更新</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	let vm;
	export default {
		created() {

		},
		data() {
			return {
				//编辑界面数据
				editFormVisible: false, //默认不显示编辑弹层
				MYURL: this.$store.state.MYURL,
				addnum: 0,
				GuanZhi_Data: [],
				option: {
					showcol: [{
						F_MC: '名称',
						F_BH: '编号'
					}],
					table: "GuanZhi",
					sqlwhere: "",
					editShow: false
				}
			};
		},
		mounted() {
			vm = this;
			axios.get(vm.MYURL + 'Select_GuanZhi.do', {
					params: {
						type: "2"
					}
				})
				.then(function(response) {
					vm.GuanZhi_Data = response.data;
				})
				.catch(function(error) {
					console.log(error);
				});
		},
		methods: {
			Save() {

			},
			deleteRow(index, rows) { //删除改行
				rows.splice(index, 1);
			},
			addDialog(index, rows) { //打开弹出窗
			},
			addRow(GuanZhi_Data, event) {
				GuanZhi_Data.push({
					needSave: 1
				})
			},
			//
			//点击编辑
			handleEdit(index, row) {
				this.editForm = Object.assign({}, row); //这句是关键！！！
			},
			PLadd(index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row); //这句是关键！！！
			},
			//点击关闭dialog
			handleClose(done) {
				/*done();
				location.reload();*/
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
			open_Dialog() { //告诉子组件
				//this.option.editShow = true;
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
				$.get(vm.MYURL + 'Select_GuanZhi.do', {
					type: "1"
				}, function(result) {
					vm.tableData = result;
					console.log(result);
				}, "json");
			}

		},
		computed: {
			sql_value() {
				return vm.$store.state.Dialog_Value;
			}
		}
	}
</script>
<style lang="css">
	.tb-edit .input-box {
		display: none
	}
	
	.tb-edit .current-cell .input-box {
		display: inline-block;
		margin-left: -15px;
	}
	
	.row-bg {
		padding: 10px 0;
	}
</style>