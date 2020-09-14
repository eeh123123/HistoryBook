<template>
	<div>
		<div class="family_position">
			<el-select class="margin-left10 margin-top10" v-model="familyValue" placeholder="请选择" @change="queryData">
				<el-option v-for="item in familyOptions" :key="item.id" :label="item.F_caption" :value="item.id">
				</el-option>
			</el-select>
			<el-select class="margin-left10 margin-top10" v-model="numberValue" placeholder="第几代" @change="changeNumber" clearable>
				<el-option v-for="item in numberOptions" :key="item.id" :label="item.F_caption" :value="item.id">
				</el-option>
			</el-select>
		</div>

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
				Array_data_Orign: [],
				familyOptions: [],
				familyValue: '',
				numberOptions: [],
				numberValue: '',
			};
		},
		methods: {
			setNumber() {
				for(let i = 0; i <= 15; i++) {
					this.numberOptions[i] = {
						id: i + 1,
						F_caption: '第' + (i - 1 + 2) + '代'
					}
				}
			},
			queryData() {
				this.numberValue = ''
				let option = {
					tablename: "person",
					showcol: ["*"],
					sqlwhere: "FAMILYID=" + this.familyValue + " OR parentFamilyid =" + this.familyValue
				}
				axios.get(this.$store.state.MYURL + 'QueryTableRow.do', {
						params: {
							tablename: option.tablename,
							showcol: option.showcol.join(","),
							sqlwhere: option.sqlwhere
						}
					})
					.then(res => {
						for(let i = 0; i < res.data.data.length; i++) {
							res.data.data[i].closed = true
							if(res.data.data[i].isCreator == 1 && res.data.data[i].familyid != this.familyValue) {
								res.data.data[i].fatherid = ""
							}
						}
						this.Array_data = this.$tools.composeTree(res.data.data)
						this.Array_data_Orign = JSON.parse(JSON.stringify(this.Array_data));
					})
			},
			changeNumber() {
				if(this.numberValue == '') {
					this.Array_data[0].children = this.Array_data_Orign[0].children
				} else {
					this.Array_data[0].children = this.$tools.dealTree(this.Array_data_Orign[0].children, this.numberValue - 1)
				}
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
			this.setNumber()
			this.queryfamilyOptions()
		}
	}
</script>

<style lang="less" scoped="scoped">
	.family_position{
		    position: fixed;
		    z-index:5;
	}
</style>