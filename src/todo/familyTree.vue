<template>
	<div>
		<el-select class="margin-left10 margin-top10" v-model="familyValue" placeholder="请选择" @change="queryData">
			<el-option v-for="item in familyOptions" :key="item.F_ID" :label="item.F_caption" :value="item.F_ID">
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
	import lwhile from '../tools/l-while-person.vue'
	import child from '../tools/l-child.vue'
	export default {
		components: {
			child,
			lwhile
		},
		data() {
			return {
				Array_data: [],
				familyOptions: [],
				familyValue: '',
			};
		},
		methods: {
			queryData() {
				let option = {
					tablename: "person",
					showcol: ["*"],
					sqlwhere: "FAMILYID=" + this.familyValue
				}
				axios.get(this.$store.state.MYURL + 'QueryTableRow.do', {
						params: {
							tablename: option.tablename,
							showcol: option.showcol.join(","),
							sqlwhere: option.sqlwhere
						}
					})
					.then(res => {
						this.Array_data = this.$tools.composeTree(res.data.data)
						this.Array_data = this.$tools.sort(this.Array_data, 'id')
						let temp = JSON.parse(JSON.stringify(this.Array_data));
						this.Array_data=[{children:"",closed:true}]
						this.Array_data[0].children = temp
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
			handleClose(){

			}
		},
		mounted() {
			this.queryData()
			this.queryfamilyOptions()
		}
	}
</script>

<style scoped="scoped"></style>
