<template>
	<div class="sonVue">
		<el-input v-model="item" placeholder="请输入物品名"></el-input>
		<el-select v-model="dct_enum" clearable filterable class="margin-left10" placeholder="请选择枚举" @change="searchs()">
			<el-option v-for="item in dct_enumOptions" :key="item.id" :label="item.F_MC" :value="item.id">
			</el-option>
		</el-select>
		<el-button type="primary" icon="el-icon-search" @click="searchs">搜索</el-button>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				item: '',
				dct_enum: '',
				dct_enumOptions: []
			}
		},
		mounted() {
			this.queryEnum()
		},
		methods: {
			queryEnum() {
				let option = {
					tablename: "dct_enums",
					showcol: ['F_MC', 'id', 'F_T2', 'F_T3'],
					sqlwhere: "F_T2=40"
				}
				axios.get(this.$store.state.MYURL + 'QueryTableRow.do', {
						params: {
							tablename: option.tablename,
							showcol: option.showcol.join(","),
							sqlwhere: option.sqlwhere
						}
					})
					.then(res => {
						this.dct_enumOptions = res.data.data
					})
			},
			searchs() {
				this.$parent.option = ""
				this.$parent.searchFlag = true
				if(this.dct_enum || this.item) {
					this.$parent.currentPage = 1
					this.$parent.option = " where 1 = 1"
				}
				if(this.dct_enum) {
					this.$parent.option += " AND A.type = '" + this.dct_enum + "'"
				}
				if(this.item) {
					this.$parent.option += " AND A.f_name like '%" + this.item + "%'"
				}
				this.$parent.queryTableData()
			}
		}
	}
</script>

<style></style>