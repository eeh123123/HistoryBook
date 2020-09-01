<template>
	<div class="sonVue">
		<el-input v-model="person" placeholder="请输入姓名"></el-input>
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
				if(this.person) {
					this.$parent.currentPage = 1
					this.$parent.option = " where B1.person_name like '%" + this.person + "%'"
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