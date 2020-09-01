<template>
	<div class="sonVue">
		<el-input v-model="attribute" placeholder="请输入特性名"></el-input>
		<el-button type="primary" icon="el-icon-search" @click="searchs">搜索</el-button>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				attribute: ''
			}
		},
		methods: {
			searchs() {
				if(this.attribute) {
					this.$parent.currentPage = 1
					this.$parent.option = " where A.F_name like '%" + this.attribute + "%'"
					this.$parent.searchFlag = false
					this.$parent.queryTableData()
				} else {
					this.$parent.option = ""
					this.$parent.searchFlag = true
					this.$parent.queryTableData()
				}
			}
		}
	}
</script>

<style>

</style>