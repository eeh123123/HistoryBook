<template>
	<div class="fillcontain">
		<el-row style="height: 100%;">
			<el-col :span="isCollapse?1:4" style="min-height: 100%; background-color: #324057;">
				<el-radio-group v-model="isCollapse">
					<el-radio-button :label="false">展开</el-radio-button>
					<el-radio-button :label="true">收起</el-radio-button>
				</el-radio-group>
				<el-menu :default-active="defaultActive" style="min-height: 100%;width:100%" router :collapse="isCollapse" :unique-opened="true">
					<el-submenu index="1">
						<template slot="title">
							<i class="el-icon-plus"></i><span v-if="!isCollapse">源数据</span>
						</template>
						<!--<el-menu-item index="addJob"><img src="../assets/smallimg/guanzhi.png"></img>官职表(不分页)</el-menu-item>-->
						<el-menu-item index="/commonDCT?dctid=guanzhi"><img src="../assets/smallimg/guanzhi.png"></img>官职表</el-menu-item>
						<el-menu-item index="/commonDCT?dctid=dept"><img src="../assets/smallimg/user.png"></img>部门表</el-menu-item>
						<el-menu-item index="/commonDCT?dctid=population"><img src="../assets/smallimg/population.png"></img>人口表</el-menu-item>
						<el-menu-item index="/commonDCT?dctid=county"><img src="../assets/smallimg/zhouxian.png"></img>州县表</el-menu-item>
						<el-menu-item index="/commonDCT?dctid=person"><img src="../assets/smallimg/renkou.png"></img>人物表</el-menu-item>
						<el-menu-item index="/commonDCT?dctid=jobTime"><img src="../assets/smallimg/lvli.png"></img>履历表</el-menu-item>
						<el-menu-item index="/commonDCT?dctid=attribute"><img src="../assets/smallimg/attribute.png"></img>特性表</el-menu-item>
						<el-menu-item index="/commonDCT?dctid=attributeTime"><img src="../assets/smallimg/attributeTime.png"></img>特性时间表</el-menu-item>
						<el-menu-item index="/commonDCT?dctid=family"><img src="../assets/smallimg/family.png"></img>家族表</el-menu-item>
						<el-menu-item index="/commonDCT?dctid=item"><img src="../assets/smallimg/treasure.png"></img>物品表</el-menu-item>
						<!--<el-menu-item index="/commonDCT?dctid=ssf_users"><img src="../assets/smallimg/user.png"></img>登陆用户表</el-menu-item>-->
						<!--<el-menu-item index="/dctEnum"><img src="../assets/smallimg/user.png"></img>枚举表</el-menu-item>-->
						<!--<el-menu-item index="/commonDCT?dctid=stone"><img src="../assets/images/stone.png" style="height: 28px;width: 28px;"></img>矿石表</el-menu-item>-->
					</el-submenu>
					<el-submenu index="2">
						<template slot="title"><img src="../assets/smallimg/look.png"></img><span v-if="!isCollapse">数据展示</span></template>
						<el-menu-item index="familyTree"><img src="../assets/smallimg/jiapushu.png"></img>家谱树</el-menu-item>
						<el-menu-item index="GuanZhiTree"><img src="../assets/smallimg/guanzhishu.png"></img>官职树</el-menu-item>
						<el-menu-item index="jobTime"><img src="../assets/smallimg/gaoguanshu.png"></img>高官树</el-menu-item>
						<el-menu-item index="calendar"><img src="../assets/smallimg/calendar.png"></img>万年历</el-menu-item>
						<el-menu-item index="map"><img src="../assets/smallimg/map.png"></img>地图</el-menu-item>
						<el-menu-item index="chuli"><img src=""></img>处理行政区划</el-menu-item>
						<el-menu-item index="zizhi"><img src=""></img>处理资治通鉴</el-menu-item>
						<el-menu-item index="textChuli"><img src=""></img>处理普通文本</el-menu-item>
					</el-submenu>
					<el-submenu index="3">
						<template slot="title">
							<div @click="tuichudenglu()">
								<img src="../assets/smallimg/logout.png"></img><span v-if="!isCollapse">退出登录</span>
							</div>
						</template>
					</el-submenu>
					<!--<el-submenu index="3">
						<template slot="title"><img src="../assets/smallimg/cat.png"></img>猫之百科</template>
						<el-menu-item index="buoList"><img src="../assets/smallimg/buo.png"></img>布偶猫名录</el-menu-item>
						<el-menu-item index="/commonDCT?dctid=buocat"><img src="../assets/smallimg/buo.png"></img>布偶猫字典</el-menu-item>
					</el-submenu>-->
					<!--<el-submenu index="4">
						<template slot="title"><i class="el-icon-warning"></i>账号管理（未完）</template>
						<el-menu-item index="adminSet">个人信息</el-menu-item>
					</el-submenu>
					<el-submenu index="6">
						<template slot="title"><i class="el-icon-warning"></i>模型设计（未完）</template>
						<el-menu-item index="Dct">字典表</el-menu-item>
					</el-submenu>-->
				</el-menu>
			</el-col>
			<el-col :span="isCollapse?23:20"  style="height: 100%;overflow: auto;">
				<keep-alive>
					<router-view></router-view>
				</keep-alive>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	export default {
		name: 'manage',
		computed: {
			defaultActive: function() {
				return this.$route.path.replace('/', '');
			}
		},
		data() {
			return {
				isCollapse: true
			}
		},
		methods: {
			tuichudenglu() {
				this.$confirm('即将退出登录，是否确认？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					localStorage.setItem("username", "");
					localStorage.setItem("password", "");
					this.deleteCookie("Authorization");
					window.location.href = "/";
					this.$message({
						type: 'success',
						message: '退出成功!'
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});
			},
			 deleteCookie(name) {     
				var  date = new  Date();     
				date.setTime(date.getTime() - 10000);     
				document.cookie = name + "=; expires=" + date.toGMTString(); 
			}
		}
	}
</script>

<style lang="less" scoped>
	@import '../assets/styles/mixin';
</style>