<template>
	<div class="hi-height">
		<LayoutTree class="dct_enum">
			<div slot="left">
				<!--<el-input placeholder="输入关键字进行过滤" v-model="filterText">
				</el-input>-->
				<!--<el-tree class="filter-tree" :data="GZB_data" :props="defaultProps" :filter-node-method="filterText" :check-strictly="true" show-checkbox highlight-current ref="Tree" @node-click="GZB_NodeClick" node-key="value" @check="GZB_checkGroupNode">
				</el-tree>-->
				<div style="height: 100%;">
					<hi-tree-c ref="tree" @change="treeListChange" @node-click="treeClick" @add-node="postTreeTypeNode" @delete-node="deleteTreeTypeNode"></hi-tree-c>
				</div>
			</div>
			<div slot="rightTop">

			</div>
			<div slot="rightBottom" style="height: 100%">

			</div>
		</LayoutTree>
	</div>
</template>
<script>
	import LayoutTree from '../tools/Layout_Tree.vue'
	import hiTreeC from '../tools/hirisun-cc-tree/index.vue'
	import RootFun from '../tools/js/getRootId.js'
	let vm
	export default {
		name: 'index-Card',
		data() {
			return {
				GZB_data: [],
				filterText: '',
				indexTreeData: [],
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				tree: {},
			}
		},
		components: {
			LayoutTree,
			hiTreeC
		},
		mounted() {
			this.tree = this.$refs.tree
			this.rootFun = new RootFun({
				parentCode: 'F_BH'
			})
			this.getLeftScene()
		},
		methods: {
			// 获取左侧的应用场景
			getLeftScene() {
				let option = {
					tablename: "DCT_ENUMS",
					showcol: ['F_MC', 'F_BH', 'F_T3'],
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
						this.initTree(res.data.data)
						this.rootFun.setListData(res.data.data)
					})
			},
			initTree(data) {
				this.tree.init({
					data: data,
					dataType: 'list',
					parentCode: 'F_T3',
					label: 'F_MC',
					code: 'F_BH',
					sortCode: 'sort',
					isFilter: true
				})
				this.$refs.tree.setCurrentKey(data[0].F_BH)
			},
			treeClick() {

			},
			filterNode() {

			},
			GZB_checkGroupNode(a, b) {
				if(b.checkedKeys.length > 0) {
					this.$refs.Tree.setCheckedKeys([a.value]);
				}
			},
			GZB_NodeClick(data) {

			},
			treeListChange(data) {
				if(this.type == 'QUERY') {
					return
				}
				this.putVisIndType(data)
			},
			postTreeTypeNode(pId, cb) {
				this._cb = cb
				this.dialogObj = this.resetIndTypeNode({})
				this.dialogVisible = true
			},
			delVisIndType(id, cb) {
				this.$axios
					.delete('/dmatvis/api/v1/vis/visScene', {
						params: {
							ids: id,
							currUser: JsCookie.get('currUser')
						}
					})
					.then(res => {
						cb(id)
						this.showMessage('success', '删除成功')
					})
			},
			deleteTreeTypeNode(id, cb, data) {
				if(data.pSceneId == '' || data.pSceneId == null) {
					this.showMessage('info', '不允许删除根节点')
					return
				}
				this.delVisIndType(id, cb)
			},
			handleNodeClick(data) {
				//    console.log(data)
			},
			handleDrop(draggingNode, dropNode, dropType, ev) {
				//    console.log(draggingNode, dropNode, this.indexTreeData, dropType)
			},
			// 左侧树的过滤
			filterNode(value, data) {
				if(!value) return true
				return data.sceneName.indexOf(value) !== -1
			},
			resetIndTypeNode(data) {
				return {
					id: data.id || '',
					pSceneId: data.pSceneId || '',
					sceneName: data.sceneName || '', //场景名称
					monContnet: data.monContnet || '' //场景概述
				}
			},
			putVisIndType(data) {
				this.$axios.put('/dmatvis/api/v1/vis/visScene', data).then(res => {
					this.showMessage('success', '更新成功')
				})
			},
			// 左侧树的点击事件
			treeClick(node) {}
		}
	}
</script>
<style lang="less">
	.hi-height {
		height: 100%;
	}
	
	.dct_enum {
		background-color: #DADCE9;
		.left,
		.right {
			background-color: white;
			padding: 10px;
		}
	}
</style>