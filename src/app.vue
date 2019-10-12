<template>
	<div id="app">
		<router-view></router-view>
		<EditDialog :visible.sync="Dialog_show" :Dialog_data.sync="Dialog_data" :title="Dialog_title" :handleCurrentChange="handleCurrentChange" :handleSizeChange="handleSizeChange"></EditDialog>
	</div>
</template>

<script>
	import login from './todo/login.vue'
	import EditDialog from './tools/EditDialog.vue'
	import Seconddialog from './tools/Seconddialog.vue'
	
	const mapState = Vuex.mapState;

	export default {
		computed: Object.assign({},
			mapState({
				Dialog_show: 'Dialog_show',
				Dialog_data: 'Dialog_data',
				Dialog_title:'Dialog_title'
			})
		),
		components: {
			login,
			EditDialog,
			Seconddialog
		},
		methods:{
			handleCurrentChange(row){
				this.$store.commit("setDialog_CurrentData", row);
			},
			handleSizeChange(a,b,c){
				
			},
		}
	}
</script>

<style lang="less">
	@import './style/common';
	#app {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	#login {
		width: 60%;
	}
	
</style>