<template>
	<div class="upFile">
		<el-container>
			<el-header style="font-size: 45px;">更新物价信息</el-header>
			<el-main>
				<div class="upFile_title">尊敬的玩家，请您使用V8的【扫街】功能在天龙八部游戏中生成物价表，选择物价表在此处上传。为了便于数据管理，建议您不要修改文件名</div>
				<el-upload class="upload" action="" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="1" :on-exceed="handleExceed" :file-list="fileList">
					<el-button size="small" type="primary" @click="upload" slot="trigger">选择文件</el-button>
					<div slot="tip" class="el-upload__tip">只能上传txt文件</div>
				</el-upload>
			</el-main>
		</el-container>

	</div>
</template>

<script>
	let vm = "";
	let name;
	let file;
	export default {
		data() {
			return {
				fileList: [],
				MYURL: this.$store.state.MYURL,
			};
		},
		methods: {
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			handlePreview(file) {
				console.log(file);
			},
			handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 1个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			},
			beforeRemove(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`);
			},
			upload() {
				$.post(this.MYURL + 'up', formData, config).then(function(data) {
					if(data.data.status == 'success') {
						$.get(myurl + "read.do", {
							params: {
								'filename': data.data.filename,
								'savename': file.name
							}
						}).then(function(response) {}).catch(function(error) {});
					}
				})
			}
		},
		mounted() {
			vm = this;
			name = document.getElementById("name");
			vm.upload_URL = vm.MYURL + "/upload";
		}
	}
</script>

<style lang="css">
	.upFile {
		text-align: center;
	}
	
	.upFile_title {
		margin-top: 30px;
	}
	
	.upload {
		margin-top: 50px;
	}
</style>