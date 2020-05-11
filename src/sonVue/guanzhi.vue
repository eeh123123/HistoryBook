<template>
	<div class="sonVue">
		<el-input v-model="person" placeholder="请输入官职名"></el-input>
		<el-select v-model="query_Dept" clearable filterable class="margin-left10" placeholder="请选择部门" @change="searchs()">
			<el-option v-for="item in GZB_data_All" :key="item.F_BH" :label="item.F_MC" :value="item.F_BH">
		</el-option>
		</el-select>
		<el-button type="primary" icon="el-icon-search" @click="searchs">搜索</el-button>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				person: '',
				query_Dept: "",
				GZB_data_All: [],
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
					showcol: ['F_MC', 'F_BH', 'F_Parent'],
					sqlwhere: "1=1 AND Dynasty = '唐' AND F_PARENT !='#'"
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
				this.$parent.option = " where 1 = 1"
				if(this.person) {
					this.$parent.option += " AND A.GuanZhi_MC like '%" + this.person + "%'"
					this.$parent.searchFlag = false
				}else if(this.query_Dept){
					this.$parent.option += " AND A.Belong like '%" + this.query_Dept + "%'"

				}
				else {
					this.$parent.option = ""
					this.$parent.searchFlag = true
				}
				this.$parent.queryTableData()
			}
		}
	}
</script>

<style>

</style>