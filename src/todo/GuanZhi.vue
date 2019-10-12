<template>
	<div>
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" class="edit-form" :before-close="handleClose">
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="名称" prop="Name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="handleCancel('editForm')">取消</el-button>
				<el-button type="primary" @click.native="handleUpdate('editForm')">更新</el-button>
			</div>
		</el-dialog>
		{{editFormVisible}}
	</div>

</template>

<script>
	let vm;
	export default {
		data() {
			return {
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					price: 0,
					desc: '',
					reserve: '',
				},
				showFlag:false
			};
		},
		mounted:{
			vm=this;
			vm.showFlag=editFormVisible;
		},
		props: {
			editFormVisible: false
		},
		methods: {
			//点击关闭dialog
			handleClose(done) {
				/*done();
				location.reload();*/
				this.editFormVisible = false;
			},

			//点击取消
			handleCancel(formName) {
				this.editFormVisible = false;
			},

			//点击更新
			handleUpdate(forName) {
				//更新的时候就把弹出来的表单中的数据写到要修改的表格中
				var postData = {
					name: this.editForm.name
				}

				//这里再向后台发个post请求重新渲染表格数据
				this.editFormVisible = false;
			}

		}
	}
</script>

<style lang="css">

</style>