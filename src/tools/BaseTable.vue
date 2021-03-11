<template>
	<div>
		<el-table class="baseTable" stripe tooltip-effect="light" :data.sync="tableData.data" :height.sync="tableHeight" @current-change="selectedTableData" highlight-current-row @sort-change="sortFunction"> 
			<!--class="tb-edit"-->
			<el-table-column v-for="(item, index) in tableHead" :value="item.code" :key="index" 
				:show-overflow-tooltip="item.COL_APP_TYPE!='enum'" :prop="item.code" :label="item.label" align="center" 
				:width="item.code == 'index' ? 50 : item.COL_SHOW_SIZE" :min-width="item['min-width']" 
				:sortable="item.COL_SORTABLE=='1'?'custom':false">
				<template slot-scope="scope">
					<!--<span>{{ scope.row[item.code] }}</span>-->
					<span v-if="item.code == 'index'">{{(Me_tableData.currentPage - 1) * pageSize + (scope.$index + 1)}}</span>
					<el-button v-else-if="item.type == 'btn'" @click="item.func(scope.row)" type="text" size="small">
						{{ scope.row[item.code]}}
					</el-button>
					<div v-else-if="item.type == 'btnArray'">
						<el-button v-for="(item1, index) in item.func" :key="index" @click="item1(scope.row)" type="text" size="small">
							{{ scope.row[item.code][index] }}
						</el-button>
					</div>
					<div v-else-if="item.COL_APP_TYPE == 'input'">
						<el-input v-model="scope.row[item.code]"></el-input>
					</div>
					<div v-else-if="item.type == 'template'"></div>
					<div v-else-if="item.COL_APP_TYPE == 'date'">
						<el-date-picker v-model="scope.row[item.code]" type="date" editable value-format="yyyy-MM-dd" style="width:140px">
						</el-date-picker>
					</div>
					<div v-else-if="item.COL_APP_TYPE == 'window'">
						<el-input suffix-icon="el-icon-circle-plus" @click.native="open_Dialog(scope.$index, scope.row,item.code)" v-model="scope.row[item.code + '_F_MC']">
						</el-input>
					</div>
					<div v-else-if="item.COL_APP_TYPE == 'icon'">
						<img :src="scope.row[item.code]" @click="openImg(scope.$index,scope.row[item.code],item.code)" style="vertical-align: middle;height:40px;width: 40px" />
					</div>
					<div v-else-if="item.COL_APP_TYPE == 'boolean'">
						<el-switch v-model="scope.row[item.code]" active-value="1" inactive-value="0">
						</el-switch>
					</div>
					<div v-else-if="item.COL_APP_TYPE == 'enum'">
						<el-select v-model="scope.row[item.code]" filterable placeholder="请选择">
							<el-option v-for="item in item.ENUM_LIST" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</div>
					<span v-else>{{ scope.row[item.code] }}</span>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @current-change="handleCurrentChange" class="hi-pagination-1" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize-0" background layout="total, prev, pager, next" :total="tableData.total" :current-page.sync="currentPage">
		</el-pagination>
		<el-dialog title="选择图片" :visible.sync="Img.Visible" :close-on-click-modal="false" v-dialogDrag custom-class="dialog-Image">
			<el-upload class="avatar-uploader" :action="Img.action" :show-file-list="false" :on-success="handleAvatarSuccess">
				<img v-if="Img.Url" :src="Img.Url" class="person-Image" />
				<i v-else class="el-icon-plus avatar-uploader-icon"></i>
			</el-upload>
		</el-dialog>
		<el-dialog :title="Dialog.title" :visible.sync="Dialog.Visible" :close-on-click-modal="false" v-dialogDrag width="30%">
			<el-input placeholder="请输入内容" v-model="Dialog.search_data" class="input-with-select">
				<el-button slot="append" icon="el-icon-search" @click="Dialog_query()"></el-button>
			</el-input>
			<el-table tooltip-effect="light" :data.sync="Dialog.tableData.data" @current-change='Dialog_selectedTableData' @row-dblclick="Dialog_save" highlight-current-row>
				<el-table-column v-for="(item, index) in Dialog.tableHead" :value="item.code" :key="index" :show-overflow-tooltip="true" :prop="item.code" :label="item.label" align='center'></el-table-column>
			</el-table>
			<el-pagination @current-change="Dialog_HandleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total,prev, pager, next" :total="Dialog.tableData.total" :current-page.sync="Dialog.currentPage">
			</el-pagination>
			<!-- 按钮区 -->
			<span slot="footer">
            <el-button type="success" icon="el-icon-check" @click="Dialog_save">保存</el-button>
            <el-button type="danger"  icon="el-icon-close" @click="Dialog_close">关闭</el-button>
        </span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				Me_tableData: {
					currentRow: null,
					currentPage: 1,
					contentId: '', //当前行的id,
					contentUrl: '', //当前行的imgURL
					F_PKEY: '', //当前字典的主键
				},
				Img: {
					Visible: false,
					Url: '',
					action: 'http://119.45.27.191:8084/up'
				},
				Dialog: {
					code: '',
					Visible: false,
					title: '',
					search_data: '',
					tableData: [],
					tableHead: [],
					currentPage: 1,
					commonData: {}, //存查询条件
					sqlwhere: "",
					currentRow: null,
				}
			};
		},
		methods: {
			getF_PKEY() {
				axios.get(this.$store.state.MYURL + "QueryTableRow.do", {
					params: {
						tablename: "dct_dicts",
						showcol: ['*'],
						sqlwhere: "DCT_ID = '" + this.$route.query.dctid + "'"
					}
				}).then(res => {
					this.Me_tableData.DCT_SORT = res.data.data[0].DCT_SORT
					this.Me_tableData.F_PKEY = res.data.data[0].DCT_FID
				})
			},
			selectedTableData(val) {
				this.Me_tableData.currentRow = val;
				this.$emit("selectedTableData", val);
			},
			openImg(index, val, colName) {
				this.Me_tableData.contentId = this.tableData.data[index].id; //这里要获取一下主键 debugger
				this.Me_tableData.contentUrl = colName
				this.Img.Visible = true;
				this.Img.Url = val;
			},
			handleAvatarSuccess(res, file) {
				this.Img.Url = this.$store.state.FWQURL + "upload/" + res.filename;
				let array_update = [{}];
				array_update[0][this.Me_tableData.F_PKEY] = this.Me_tableData.contentId
				array_update[0][this.Me_tableData.contentUrl] = this.Img.Url
				axios.post(this.$store.state.MYURL + "UpdateTableRow.do", {
					params: {
						tablename: this.$route.query.dctid,
						values: array_update
					}
				}).then(res => {
					for(let i = 0;i<this.tableData.data.length;i++){
						if(this.tableData.data[i].id==this.Me_tableData.contentId){
							this.tableData.data[i].imgURL = this.Img.Url;
						}
					}
					this.$message({
						type: "success",
						message: res.data.msg
					});
				})
			},

			open_Dialog(index, item, code) {
				this.Dialog.code = code
				let data = this.tableData.map.get(code)
				this.Dialog.commonData = data
				this.Dialog_query()
				this.Dialog.search_data = "";
				this.Dialog.Visible = true
			},
			Dialog_query() {
				if(this.Dialog.search_data != "") {
					this.Dialog.sqlwhere = " AND " + this.Dialog.commonData.F_Caption + " LIKE '%" + this.Dialog.search_data + "%'"
				} else {
					this.Dialog.sqlwhere = ""
				}
				this.Dialog.currentPage = 1
				this.Dialog_queryData(this.Dialog.commonData)
			},
			Dialog_queryData(data) {
				axios.get(this.$store.state.MYURL + "QueryTableRow.do", {
					params: {
						tablename: data.tablename,
						showcol: [data.F_Pkey, data.F_Caption],
						sqlwhere: "1=1 " + this.Dialog.sqlwhere + " Limit " + (this.Dialog.currentPage - 1) * 10 + ",10"
					}
				}).then(res => {
					this.Dialog.tableHead = [{
							code: data.F_Pkey,
							label: data.F_Pkey_Name
						},
						{
							code: data.F_Caption,
							label: data.F_Caption_Name,
						}
					]
					this.Dialog.tableData = res.data
				})
			},
			Dialog_selectedTableData(val) {
				this.Dialog.currentRow = val;
			},
			Dialog_HandleCurrentChange() {
				this.Dialog_queryData(this.Dialog.commonData)
			},
			Dialog_save() {
				Vue.set(this.Me_tableData.currentRow, this.Dialog.code, this.Dialog.currentRow[this.Dialog.commonData.F_Pkey])
				Vue.set(this.Me_tableData.currentRow, this.Dialog.code + "_F_BH", this.Dialog.currentRow[this.Dialog.commonData.F_Pkey])
				Vue.set(this.Me_tableData.currentRow, this.Dialog.code + "_F_MC", this.Dialog.currentRow[this.Dialog.commonData.F_Caption])
				this.Dialog.Visible = false
				this.Dialog.search_data = ''
			},
			Dialog_close() {
				this.Dialog.Visible = false
				this.Dialog.search_data = ''
			},
			sortFunction(column, prop, order){
				this.$emit("sortBy",column)
			}
		},
		mounted() {
			this.getF_PKEY()
		},
		props: {
			tableData: Object,
			tableHead: Array,
			tableHeight: Number,
			pageSize: [Number, String],
			currentPage:[Number, String],
			handleCurrentChange: Function,
		}
	};
</script>
<style>
	/*.el-table td, .el-table th{
		padding: 2px!important;
	}*/
</style>