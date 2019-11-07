<template>
	<div>
		<el-form label-width="130px" size="small">
			<el-form-item>
				<el-button type="primary" @click="addRow()">新增</el-button>
				<el-button type="primary" @click="handleEdit()">批量添加官员</el-button>
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
								<el-input suffix-icon="el-icon-circle-plus" @click.native="openSqlWindow()" v-model="scope.row.PinJie"></el-input><span>{{scope.row.PinJie}}</span>
							</template>
						</el-table-column>
						<el-table-column label="所属部门" width="100">
							<template slot-scope="scope">
								<el-input size="small" v-model="scope.row.Belong" placeholder="" @change="handleEdit(scope.$index, scope.row)"></el-input> <span>{{scope.row.Belong}}</span>
							</template>
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
			<div slot="footer" class="dialog-footer" v-show="doalog_guanzhi">
				<el-button @click.native="handleCancel('editForm')">取消</el-button>
				<el-button type="primary" @click.native="handleUpdate('editForm')">更新</el-button>
			</div>
		</el-dialog>

		<el-dialog id="dialog" :title="title" :before-close="beforeClose" v-show="guanzhi_show" center modal v-dialogDrag width="600px">
			<el-input placeholder="请输入内容" v-model="Dialog_search_data" class="input-with-select">
				<el-button slot="append" icon="el-icon-search" @click="query()"></el-button>
			</el-input>
			<el-table :data.sync="Dialog_data" style="width: 100%">
				<el-table-column width="180" label="">
					<template slot-scope="scope">
						<span>{{scope.row.F_MC}}</span>
					</template>
				</el-table-column>
				<el-table-column width="180" label="">
					<template slot-scope="scope">
						<span>{{scope.row.F_BH}}</span>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total,prev, pager, next, jumper" :total="400">
			</el-pagination>
			<!-- 插槽区 -->
			<slot></slot>
			<!-- 按钮区 -->
			<span slot="footer">
            <el-button type="success" icon="el-icon-check" @click="save">保存</el-button>
            <el-button type="danger"  icon="el-icon-close" @click="close">关闭</el-button>
        </span>
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
				},
				guanzhi_dialog: false,
				showcol: {
					F_MC: '名称',
					F_BH: '编号'
				},
				title: "官职表",
				Dialog_data: [],
				Dialog_search_data: "",
				currentPage: 1,
				guanzhi_show: false
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
			openSqlWindow() {
				this.guanzhi_show = true;
			},
			deleteRow(index, rows) { //删除改行
				rows.splice(index, 1);
			},
			addDialog(index, rows) { //打开弹出窗
			},
			addRow() {
				vm.GuanZhi_Data.push({

				})
			},
			//
			//点击编辑
			handleEdit(index, row) {
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

			beforeClose() {
				this.close()
			},
			close() {
				this.$store.commit('setshow', false)
			},
			save() {
				this.$refs.multipleTable.store.states.selection
				//this.$store.commit('setSQL_value', )

				this.$store.commit('setshow', false)
			},
			query() {
				let sql = " 1=1 AND ";
				for(let i = 0; i < this.$store.state.Dialog_showcol.length; i++) {
					sql += this.$store.state.Dialog_showcol[i] + " LIKE '%" + this.Dialog_search_data + "%' OR ";
				}
				sql = sql.substring(0, sql.length - 3);
				axios.get(vm.MYURL + 'QueryTableRow.do', {
						params: {
							tablename: this.$store.state.Dialog_tablename,
							showcol: this.$store.state.Dialog_showcol.join(","),
							sqlwhere: sql
						}
					})
					.then(function(response) {
						vm.Dialog_data = response.data;
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			handleSizeChange() {

			},
			handleCurrentChange() {

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