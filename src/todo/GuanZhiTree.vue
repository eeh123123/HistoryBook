<template>
	<div>
		<el-select v-model="query_Dept" clearable filterable class="margin-left10 margin-top10" placeholder="请选择部门" @change="searchs()">
			<el-option v-for="item in GZB_data_All" :key="item.F_BH" :label="item.F_MC" :value="item.F_BH">
			</el-option>
		</el-select>
		<div class="tree">
			<ul>
				<child v-for="item in Array_data" :key="item.fatherid" :text="item">
					<lwhile :item="item"></lwhile>
				</child>
			</ul>
		</div>
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
				familyOptions: [],
				familyValue: '',
			};
		},
		methods: {
			//查询所有部门
			query_GZB_data_All() {
				let option = {
					tablename: "dept",
					showcol: ['F_MC', 'F_BH', 'F_Parent'],
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
				let option = {
					tablename: "GuanZhi",
					sqlwhere: "1=1"
				}
				if(vm.query_Dept) {
					option.sqlwhere += " AND Belong ='" + vm.query_Dept + "'";
				}
				axios.get(this.$store.state.MYURL + 'QueryTableRow.do', {
						params: {
							tablename: option.tablename,
							showcol: "*",
							sqlwhere: option.sqlwhere + " Order By Belong,(PinJie_FBH+0) ,ID"
						}
					})
					.then(function(res) {
						vm.Array_data = vm.$tools.composeTree(res.data.data)
						vm.Array_data = vm.$tools.sort(vm.Array_data, 'id')
						let temp = JSON.parse(JSON.stringify(vm.Array_data));
						vm.Array_data=[{children:"",closed:true}]
						vm.Array_data[0].children = temp
					})
			},
			queryfamilyOptions() {
				let option = {
					tablename: "family",
					showcol: ["*"],
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
						this.familyOptions = res.data.data
					})
			},
			handleClose() {

			}
		},
		mounted() {
			vm = this
			this.query_GZB_data_All()
			this.queryfamilyOptions()
		}
	}
</script>

<style scoped="scoped"></style>
