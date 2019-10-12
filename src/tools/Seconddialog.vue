<template>
	<el-dialog id="dialog" :title="title" :before-close="beforeClose" :visible.sync="visible">
		<el-input placeholder="请输入内容" v-model="Dialog_search_data" class="input-with-select">
			<el-button slot="append" icon="el-icon-search" @click="query()"></el-button>
		</el-input>
		<el-table :data.sync="Dialog_data" style="width: 100%">
			<el-table-column width="180" label="">
				<template slot-scope="scope">
					<span>{{scope.row.F_MC}}</span>
				</template>
			</el-table-column>
			<el-table-column width="180" label="">
				<template slot-scope="scope">
					<span>{{scope.row.F_BH}}</span>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400">
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

	export default {
		computed: {
			init: function() {

			}
		},
		created() {
			vm = this;
		},
		data() {
			return {
				Dialog_search_data: "",
				MYURL: this.$store.state.MYURL
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
				this.$store.commit('setshow', false)
			},
			query() {

			},
			handleSizeChange() {

			},
			handleCurrentChange() {

			}
		},
		mounted() {

		},
		props: {
			option: Array,
			visible: Boolean,
		},
		watch: {

		}
	}
</script>