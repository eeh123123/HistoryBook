<template>
	<div class="bg">
		<div id="login">
			<div class="login_title">
				系统登录
			</div>
			<div class="line">
				<div class="right">用户名:</div>
				<div class="left">
					<el-input v-model="username" placeholder="请输入用户名"></el-input>
				</div>
			</div>
			<div class="line">
				<div class="right">密码:</div>
				<div class="left">
					<el-input v-model="password" show-password></el-input>
				</div>
			</div>
			<div class="line button_line">
				<el-row>
					<el-button @click="Login()">登录</el-button>
				</el-row>
				<p class="tip">温馨提示：未登录过的新用户,自动注册</p>
			</div>
		</div>
	</div>
</template>

<script>
	let vm;
	export default {
		data() {
			return {
				username: '',
				password: '',
				MYURL: this.$store.state.MYURL,
			}
		},
		mounted() {
			vm = this;
			vm.username = localStorage.getItem("username");
			vm.password = localStorage.getItem("password");
			if(vm.username && vm.password) {
				vm.Login();
			}
		},
		methods: {
			Login: function() {
				if(vm.username == "" || vm.username == undefined || vm.username == null) {
					this.$message.error("用户名不能为空");
					return;
				}
				if(vm.password == "" || vm.password == undefined || vm.password == null) {
					this.$message.error("密码不能为空");
					return;
				}
				let vm_u = vm.username.replace(/\s*/g, "");
				let vm_p = vm.password.replace(/\s*/g, "");
				if(vm_u == "") {
					this.$message.error("用户名不能为全空格");
					return;
				}
				if(vm_p == "") {
					this.$message.error("密码不能为全空格");
					return;
				}
				axios.get(vm.MYURL + 'Login.do', {
					params: {
						username: vm.username,
						password: vm.password
					}
				}).then(res => {
					if(res.data.rows == "0") {
						vm.$message({
							showClose: true,
							message: "用户名或密码错误",
							type: 'success'
						});
						vm.Register();
					} else if(res.data.rows == "1") {
						vm.$message({
							showClose: true,
							message: res.data.text,
							type: 'success'
						});
						localStorage.setItem("username", vm.username);
						localStorage.setItem("password", vm.password);
						vm.$router.push('manage')
					} else if(res.data.rows == "-1") {
						vm.$message({
							showClose: true,
							message: res.data.text,
							type: 'success'
						});
					}
				})
			},
			Register: function() {
				$.get(vm.MYURL + 'Register.do', {
					username: vm.username,
					password: vm.password
				}, function(data) {
					if(data.rows == "1") {
						vm.$message({
							showClose: true,
							message: data.text,
							type: 'success'
						});
						localStorage.setItem("username", vm.username);
						localStorage.setItem("password", vm.password);
						vm.$router.push('manage')
					}
				}, "json");
			}
		}
	}
</script>
<style lang="less" scoped>
	@import '../assets/styles/mixin';
</style>
<style lang="css" scoped>
	.bg {
		width: 100%;
		height: 100%;
		background-image: url("../assets/images/login_bg.jpg");
		background-size: cover;
	}

	#login {
		width: 400px;
		position: absolute;
		top: 50%;
		left: 50%;
		background: rgba(255, 255, 255, 1);
		border-radius: 8px;
		margin-top: -200px;
		transform: translateX(-50%);
		-ms-transform: translateX(-50%);
		/* IE 9 */
		-moz-transform: translateX(-50%);
		/* Firefox */
		-webkit-transform: translateX(-50%);
		/* Safari 鍜�Chrome */
		-o-transform: translateX(-50%);
		/* Opera */
	}

	.login_title {
		padding: 20px 0;
		border-bottom: 1px solid #e5e5e5;
		color: #1688ef;
		font-size: 22px;
		text-align: center;
		margin-bottom: 15px;
	}

	.line {
		height: 50px;
	}

	.line>div {
		display: inline-block;
		position: relative;
	}

	.right {
		width: 120px;
		text-align: right;
	}

	.button_line {
		margin-top: 20px;
	}

	#app {
		background-image: url("../assets/images/timg.jpg");
	}

	.left {
		width: 220px;
	}

	.el-form-item {
		margin-bottom: 0px
	}

	.el-form--inline .el-form-item {
		margin-right: 0;
	}

	.tip {
		color: red;
		margin-left: 40px;
	}

	.button_line {
		height: 120px;
	}

	.el-row {
		margin-left: 125px;
	}
</style>
