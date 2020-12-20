<template>
	<div class="sonVue">
		<el-input v-model="person" placeholder="请输入官职名"></el-input>
		<el-select v-model="query_Dept" clearable filterable class="margin-left10" placeholder="请选择部门" @change="searchs()">
			<el-option v-for="item in GZB_data_All" :key="item.id" :label="item.F_MC" :value="item.id">
		</el-option>
		</el-select>
		<el-button @click="KJ_add()">快捷添加官员</el-button>
		<el-button type="primary" icon="el-icon-search" @click="searchs">搜索</el-button>
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
	</div>
</template>

<script>
	export default {
		data() {
			return {
				person: '',
				query_Dept: "",
				GZB_data_All: [],
				GZB_data: [],
				GZBVisible: false,
				GZB_data: [],
				GZB_filterText: '',
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				KJFormVisible: false, //默认不显示快捷添加官职图层
				KJ_FirstName: "",
				KJ_GuanZhi: "",
				KJ_Caption: "",
			}
		},
		mounted(){
			this.query_GZB_data_All()
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
					.then(res => {
						this.GZB_data_All = res.data.data;
					})
			},
			searchs() {
				this.$parent.option = ""
				this.$parent.searchFlag = true
				if(this.person||this.query_Dept){
					this.$parent.currentPage = 1
					this.$parent.option = " where 1 = 1"
				}
				if(this.person) {
					this.$parent.option += " AND A.GuanZhi_MC like '%" + this.person + "%'"
//					this.$parent.searchFlag = false
				}
				if(this.query_Dept){
					this.$parent.option += " AND A.Belong =" + this.query_Dept + ""
				}
				this.$parent.queryTableData()
			},
			//快捷添加官员方法
			KJ_add() {
				this.KJFormVisible = true;
			},
			KJ_Read() {
				this.KJ_FirstName
				this.KJ_Caption = this.KJ_Caption.replace("　　", "　");
				this.KJ_Caption = this.KJ_Caption.replace(/[\r\n]/g, "");
				let Number_Array = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"]
				let array = this.KJ_Caption.split("　");
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
							values[i] = ["",  this.KJ_FirstName + array[i].substr(0, index), this.$tools.ChineseToNumber(array[i].substr(index)), this.KJ_GuanZhi];
							break;
						}
					}
				}

				axios.post(this.$store.state.MYURL + 'InsertTableRow_Origin.do', {
						params: {
							tablename: "guanzhi",
							Insertcol: "PinJie,GuanZhi_MC,personSize,Belong",
							values: values
						}
					})
					.then(res => {
						this.$message({
							type: 'success',
							message: res.data.msg
						});
						this.searchs();
					})
			},
			SSBM(index, row, type) {
				this.GZB_data = []
				this.GZBVisible = true
				this.GZB_filterText = '' //每次打开官职表时，置空查询条件
				if(type == 0) {
					this.GuanZhiType = 0;
					this.GuanZhi_EditIndex = index || 0
				}
				if(index == undefined) {
					this.GuanZhiType = 1;
				} else if(index == "KJ") {
					this.GuanZhiType = 2;
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
					.then(response => {
						for(let i = 0; i < response.data.data.length; i++) {
							if(response.data.data[i].F_Parent === "#") {
								this.GZB_data.push({
									label: response.data.data[i].F_MC,
									value: response.data.data[i].id,
									id: response.data.data[i].id,
									children: []
								})
							}
						}
						for(let i = 0; i < response.data.data.length; i++) {
							for(let j = 0; j < this.GZB_data.length; j++) {
								if(response.data.data[i].F_Parent == this.GZB_data[j].value) {
									this.GZB_data[j].children.push({
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
			GZB_checkGroupNode(a, b) {
				if(b.checkedKeys.length > 0) {
					this.$refs.Tree.setCheckedKeys([a.value]);
				}
			},
			GZB_Sure() {
				if(this.GuanZhiType == 0) {
					this.GuanZhi_Data[this.GuanZhi_EditIndex].Belong = this.$refs.Tree.getCheckedNodes()[0].value
				} else if(this.GuanZhiType == 1) {
					this.PLAdd_Data.Belong = this.$refs.Tree.getCheckedNodes()[0].value
				} else if(this.GuanZhiType == 2) {
					this.KJ_GuanZhi = this.$refs.Tree.getCheckedNodes()[0].value
				}
				this.GZBVisible = false
			},
		}
	}
</script>

<style>

</style>