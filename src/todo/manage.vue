<template>
	<div class="manage_page fillcontain">
		<el-row style="height: 100%;">
	  		<el-col :span="4"  style="min-height: 100%; background-color: #324057;">
				<el-menu :default-active="defaultActive" style="min-height: 100%;" theme="dark" router>
					<el-menu-item index="manage"><i class="el-icon-menu"></i>首页</el-menu-item>
					<el-submenu index="1">
						<template slot="title"><i class="el-icon-plus"></i>添加数据</template>
						<el-menu-item index="addPerson">生死簿</el-menu-item>
						<el-menu-item index="addJob">官职表</el-menu-item>
						<el-menu-item index="familyTree">家谱树</el-menu-item>
						<el-menu-item index="/commonDCT?dctid=attribute">特性表</el-menu-item>
						<el-menu-item index="/commonDCT?dctid=attributeTime">特性时间表</el-menu-item>
						<el-menu-item index="/commonDCT?dctid=family">家族表</el-menu-item>
						<el-menu-item index="/commonDCT?dctid=person">人物表(未做)</el-menu-item>
						<el-menu-item index="experience">添加履历(未做)</el-menu-item>
						<el-menu-item index="upFile">添加物价表</el-menu-item>
					</el-submenu>
					<el-submenu index="2">
						<template slot="title"><i class="el-icon-warning"></i>技术说明</template>
						<el-menu-item index="explain">技术说明</el-menu-item>
					</el-submenu>
					<el-submenu index="3">
						<template slot="title"><i class="el-icon-warning"></i>天龙八部相关</template>
						<el-menu-item index="WuJia">物价表</el-menu-item>
						<el-menu-item index="FWQ">服务器列表</el-menu-item>
					</el-submenu>
					<el-submenu index="4">
						<template slot="title"><i class="el-icon-warning"></i>唐</template>
						<el-menu-item index="calendar">万年历</el-menu-item>
					</el-submenu>
					<el-submenu index="5">
						<template slot="title"><i class="el-icon-warning"></i>账号管理</template>
						<el-menu-item index="adminSet">个人信息</el-menu-item>
					</el-submenu>
					<el-submenu index="6">
						<template slot="title"><i class="el-icon-warning"></i>模型设计</template>
						<el-menu-item index="Dct">字典表</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-col>
			<el-col :span="20" style="height: 100%;overflow: auto;">
				<keep-alive>
				    <router-view></router-view>
				</keep-alive>
			</el-col>
		</el-row>
  	</div>
</template>

<script>
    export default {
	computed: {
			defaultActive: function(){
				return this.$route.path.replace('/', '');
			}
		},
		watch:{
			// $route(to,from){
			// 	this.$router.push(to.fullPath)
			// }
		},
    }
</script>

<style lang="less" scoped>
	@import '../style/mixin';
	.manage_page{

	}
</style>
