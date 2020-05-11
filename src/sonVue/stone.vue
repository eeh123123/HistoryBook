<template>
	<div class="sonVue">
		<el-input v-model="name" placeholder="请输入矿物名" @change="searchs()"></el-input>
		<div>
			是否是纯净物
				<el-select v-model="pureValue" filterable clearable @change="searchs()">
					<el-option v-for="item in pureList" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
		</div>
		<el-button type="primary" icon="el-icon-search" @click="searchs">搜索</el-button>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				name: '',
				pureValue:'',
				pureList: [{
					label: "全部",
					value: ''
				}, {
					label: "纯净物",
					value: '1'
				}, {
					label: "混合物",
					value: '0'
				}],
			}
		},
		methods: {
			searchs() {
				this.$parent.option = " WHERE 1 = 1 "
				if(this.name) {
					this.$parent.option += " AND A.name like '%" + this.name + "%' OR A.otherName like '%" + this.name + "%'"
					this.$parent.searchFlag = false
				}
				else if(this.pureValue){
					this.$parent.option += " AND A.isPure ='"+this.pureValue+"'"
					this.$parent.searchFlag = false
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