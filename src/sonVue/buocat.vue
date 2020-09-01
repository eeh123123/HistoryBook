<template>
	<div class="sonVue">
		<el-button type="primary" icon="el-icon-search" @click="searchs">搜索</el-button>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				person: ''
			}
		},
		methods: {
			searchs() {
				if(this.person){
					this.$parent.currentPage = 1
					this.$parent.option = " where A.person_name like '%"+this.person + "%'"
					this.$parent.searchFlag = false
					this.$parent.queryTableData()
				}
			}
		}
	}
</script>

<style>

</style>