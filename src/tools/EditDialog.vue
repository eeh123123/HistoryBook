<template>
	<el-dialog id="dialog" :title="title" :before-close="beforeClose" :visible.sync="visible" center modal v-dialogDrag width="500px">
		<el-input placeholder="请输入内容" v-model="Dialog_search_data" class="input-with-select">
			<el-button slot="append" icon="el-icon-search" @click="query()"></el-button>
		</el-input>
		<el-table tooltip-effect="light" :data.sync="tableData.data" @current-change='selectedTableData' @row-dblclick="save" highlight-current-row>
			<el-table-column v-for="(item, index) in tableHead" :value="item.code" :key="index" :show-overflow-tooltip="true" :prop="item.code" :label="item.label" align='center'></el-table-column>
		</el-table>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total,prev, pager, next" :total="tableData.total" :current-page.sync="currentPage">
		</el-pagination>
		<!-- 插槽区 -->
		<slot></slot>
		<!-- 按钮区 -->
		<span slot="footer">
            <el-button type="success" icon="el-icon-check" @click="save">保存</el-button>
            <el-button type="danger"  icon="el-icon-close" @click="close">关闭</el-button>
        </span>
	</el-dialog>
</template>

<script>
	let vm = "";
	import '../Func.js'

	export default {
		created() {
			vm = this;
		},
		data() {
			return {
				Dialog_search_data: "",
				MYURL: this.$store.state.MYURL,
				currentRow: null,
				currentPage: 1
			}
		},
		methods: {
			beforeClose() {
				this.close()
			},
			close() {
				this.$store.commit('setshow', false)
			},
			save() {
				let time = new Date().getTime()
				this.$store.commit('setDialog_CallBack', time)
				this.$store.commit('setshow', false)
				
				this.callBack(this.currentRow)
			},
			query() {
				let sql = " 1=1 AND ";
				for(let i = 0; i < this.$store.state.Dialog_showcol.length; i++) {
					sql += this.$store.state.Dialog_showcol[i] + " LIKE '%" + this.Dialog_search_data + "%' OR ";
				}
				sql = sql.substring(0, sql.length - 3);
				axios.get(vm.MYURL + 'QueryTableRow.do', {
						params: {
							tablename: this.$store.state.Dialog_tablename,
							showcol: this.$store.state.Dialog_showcol.join(","),
							sqlwhere: sql
						}
					})
					.then(function(response) {
						vm.$store.commit('setCol', response.data);
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			selectedTableData(val){
				this.currentRow=val
			}
		},
		mounted() {

		},
		props: {
			showcol: {
				type: Array, //数值类型
				default() {
					return [{
						F_MC: '名称',
						F_BH: '编号'
					}]
				},
				validator(showcol) {
					return typeof showcol === 'object'
				}
			},
			title: {
				type: String,
				default: '存储表'
			},
			visible: Boolean,
			tableData:Object,
			tableHead:Array,
			handleCurrentChange: Function,
			handleSizeChange: Function,
			callBack: Function,
		}
	}
</script>
<style lang="less">
	#dialog {
		th {
			padding: 0px;
			line-height: 0px;
		}
		td {
			padding-bottom: 3px;
			padding-top: 3px;
		}
	}
</style>