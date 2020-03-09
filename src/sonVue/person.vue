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
				if(this.person){
					this.$parent.option = " where A.person_name like '%"+this.person + "%'"
					this.$parent.queryTableData()
				}
			}
		}
	}
</script>

<style>

</style>