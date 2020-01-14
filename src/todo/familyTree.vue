<template>
	<div class="tree">
		<ul>
			<child v-for="item in Array_data" :key="item.fatherid" :text="item">
				<lwhile :item="item"></lwhile>
			</child>
		</ul>
	</div>
</template>

<script>
	import lwhile from './l-while.vue'
	import child from './l-child.vue'
	export default {
		components: {
			child,
			lwhile
		},
		data() {
			return {
				Array_data: []
			};
		},
		methods: {
			queryData() {
				let _this = this
				let option = {
					tablename: "person",
					showcol: ["*"],
					sqlwhere: "FAMILYID='1'"
				}
				axios.get(this.$store.state.MYURL + 'QueryTableRow.do', {
						params: {
							tablename: option.tablename,
							showcol: option.showcol.join(","),
							sqlwhere: option.sqlwhere
						}
					})
					.then(function(response) {
						_this.Array_data = _this.$tools.composeTree(response.data.data)
						_this.Array_data = _this.$tools.sort(_this.Array_data, 'id')
					})
			}
		},
		mounted() {
			this.queryData()
		}
	}
</script>

<style scoped="scoped">
	
</style>