<template>
	<div class="sonVue">
		<el-input v-model="sql" placeholder="sql联查"></el-input>
		<el-input v-model="name" placeholder="请输入州府名"></el-input>
		<el-input v-model="startyear" placeholder="起年"></el-input>
		<el-input v-model="endyear" placeholder="止年"></el-input>
		<el-select v-model="query_Dept" clearable filterable class="margin-left10" placeholder="选择道属" @change="searchs()" style="width: 100px;">
			<el-option v-for="item in GZB_data_All" :key="item.id" :label="item.name" :value="item.id">
			</el-option>
		</el-select>
		<el-button type="primary" icon="el-icon-search" @click="searchs">搜索</el-button>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				sql:'',
				name: '',
				query_Dept: "",
				GZB_data_All: [],
				startyear:'',
				endyear:''
			}
		},
		mounted() {
			this.query_GZB_data_All()
		},
		methods: {
			//查询所有部门
			query_GZB_data_All() {
				let option = {
					tablename: "county",
					showcol: ['name', 'id', 'f_parent'],
					sqlwhere: "1=1"
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
				if(this.query_Dept||this.name||this.sql||this.startyear||this.endyear) {
					this.$parent.option = " where 1 = 1"
				}
				if(this.name){
					this.$parent.option += " AND A.name like '%" + this.name + "%'"
				}
				if(this.query_Dept) {
					this.$parent.option += " AND A.f_parent =" + this.query_Dept + ""

				}
				if(this.sql){
					this.$parent.option += " AND A.name in (" + this.sql + ")"
				}
				if(this.startyear){
					this.$parent.option += " AND A.startyear < " + this.startyear
				}
				if(this.endyear){
					this.$parent.option += " AND A.endyear > " + this.endyear
				}
				this.$parent.queryTableData()
			}
		}
	}
</script>

<style></style>