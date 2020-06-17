<template>
	<div class="fillcontain">
		<el-row style="height: 100%;">
			<el-col :span="4" style="min-height: 100%; background-color: #324057;">
				<el-menu :default-active="defaultActive" style="min-height: 100%;" theme="dark" router>
					<el-menu-item index="manage"><i class="el-icon-menu"></i>首页</el-menu-item>
					<el-submenu index="1">
						<template slot="title"><i class="el-icon-plus"></i>源数据</template>
<!--						<el-menu-item index="addJob"><img src="../assets/smallimg/guanzhi.png"></img>官职表(不分页)</el-menu-item>
-->						<el-menu-item index="/commonDCT?dctid=guanzhi"><img src="../assets/smallimg/guanzhi.png"></img>官职表</el-menu-item>
						<el-menu-item index="/commonDCT?dctid=dept"><img src="../assets/smallimg/user.png"></img>部门表</el-menu-item>
						<el-menu-item index="/commonDCT?dctid=person"><img src="../assets/smallimg/renwu.png"></img>人物表</el-menu-item>
						<el-menu-item index="/commonDCT?dctid=jobtime"><img src="../assets/smallimg/guanzhi.png"></img>履历表</el-menu-item>
						<el-menu-item index="/commonDCT?dctid=attribute"><img src="../assets/smallimg/attribute.png"></img>特性表</el-menu-item>
						<el-menu-item index="/commonDCT?dctid=attributeTime">特性时间表</el-menu-item>
						<el-menu-item index="/commonDCT?dctid=family"><img src="../assets/smallimg/family.png"></img>家族表</el-menu-item>
						<el-menu-item index="/commonDCT?dctid=item"><img src="../assets/smallimg/treasure.png"></img>物品表</el-menu-item>
						<el-menu-item index="/commonDCT?dctid=ssf_users"><img src="../assets/smallimg/user.png"></img>登陆用户表</el-menu-item>
						<el-menu-item index="/dctEnum"><img src="../assets/smallimg/user.png"></img>枚举表</el-menu-item>
						<el-menu-item index="/commonDCT?dctid=stone"><img src="../assets/images/stone.png" style="height: 28px;width: 28px;"></img>矿石表</el-menu-item>
						<!--<el-menu-item index="experience">履历表(未做)</el-menu-item>-->
					</el-submenu>
					<el-submenu index="2">
						<template slot="title"><img src="../assets/smallimg/look.png"></img>数据展示</template>
						<el-menu-item index="familyTree"><img src="../assets/smallimg/jiapushu.png"></img>家谱树</el-menu-item>
						<el-menu-item index="GuanZhiTree"><img src="../assets/smallimg/guanzhishu.png"></img>官职树</el-menu-item>
						<el-menu-item index="calendar"><img src="../assets/smallimg/calendar.png"></img>万年历</el-menu-item>
						<el-menu-item index="map"><img src="../assets/smallimg/map.png"></img>地图</el-menu-item>
					</el-submenu>
					<el-submenu index="3">
						<template slot="title"><img src="../assets/smallimg/cat.png"></img>猫之百科</template>
						<el-menu-item index="buoList"><img src="../assets/smallimg/buo.png"></img>布偶猫名录</el-menu-item>
						<el-menu-item index="/commonDCT?dctid=buocat"><img src="../assets/smallimg/buo.png"></img>布偶猫字典</el-menu-item>
					</el-submenu>
					<el-submenu index="4">
						<template slot="title"><i class="el-icon-warning"></i>账号管理（未完）</template>
						<el-menu-item index="adminSet">个人信息</el-menu-item>
					</el-submenu>
					<el-submenu index="6">
						<template slot="title"><i class="el-icon-warning"></i>模型设计（未完）</template>
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
			defaultActive: function() {
				return this.$route.path.replace('/', '');
			}
		}
	}
</script>

<style lang="less" scoped>
	@import '../assets/styles/mixin';
</style>
