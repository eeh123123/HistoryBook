<template>
	<div>
		<el-select v-model="query_Dept" clearable filterable class="margin-left10 margin-top10" placeholder="请选择部门" @change="searchs()">
			<el-option v-for="item in GZB_data_All" :key="item.id" :label="item.F_MC" :value="item.id">
			</el-option>
		</el-select>
		<!--<el-input suffix-icon="el-icon-circle-plus" @click.native="SSBM()" v-model="query_Dept" class="margin-left10 margin-top10" style="width: 100px;">
		</el-input>-->
		<div class="tree">
			<ul>
				<child v-for="item in Array_data" :key="item.fatherid" :text="item">
					<lwhile :item="item"></lwhile>
				</child>
			</ul>
		</div>
		<!--<el-dialog title="部门表" :visible.sync="GZBVisible" :close-on-click-modal="false" v-dialogDrag>
			<div class="GZB">
				<el-input placeholder="输入关键字进行过滤" v-model="GZB_filterText">
				</el-input>
				<el-tree class="filter-tree" :data="GZB_data" :props="defaultProps" :filter-node-method="GZB_filterNode" :check-strictly="true" show-checkbox highlight-current ref="Tree" @node-click="GZB_NodeClick" node-key="value" @check="GZB_checkGroupNode">
				</el-tree>
				<el-button type="primary" @click="GZB_Sure">确认</el-button>
				<el-button @click="GZBVisible=false">取消</el-button>
			</div>
		</el-dialog>-->
	</div>
</template>

<script>
	import lwhile from '../tools/l-while-guanzhi.vue'
	import child from '../tools/l-child.vue'
	let vm
	export default {
		components: {
			child,
			lwhile
		},
		data() {
			return {
				query_Dept: "",
				GZB_data_All: [],
				Array_data: [],
				GZBVisible: false,
				GZB_data: [],
				GZB_filterText: '',
				defaultProps: {
					children: 'children',
					label: 'label'
				},
			};
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
				let params = {
					tablename: "guanzhi",
					pageSqlwhere: "",
					searchFlag: this.searchFlag
				}
				if(vm.query_Dept) {
					params.sqlwhere = " WHERE A.Belong ='" + vm.query_Dept + "'";
				}
				axios.get(this.$store.state.MYURL + 'QueryDct.do', {
					params: params
				}).then(res => {
					debugger
					vm.Array_data = vm.$tools.composeTree_Orign(res.data.data)
					vm.Array_data = vm.$tools.sort(vm.Array_data, 'id')
					let temp = JSON.parse(JSON.stringify(vm.Array_data));
					vm.Array_data = [{
						children: "",
						closed: true
					}]
					vm.Array_data[0].children = temp
				})
			},
			handleClose() {

			},
			GZB_filterNode(value, data) {
				if(!value) return true;
				return data.label.indexOf(value) !== -1;
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
		},
		mounted() {
			vm = this
			this.query_GZB_data_All()
		}
	}
</script>

<style scoped="scoped"></style>