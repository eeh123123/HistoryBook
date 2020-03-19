import App from './app.vue'
import VueRouter from 'vue-router'

import './assets/styles/global.less'
import './assets/styles/tree.less'

import login from './todo/login.vue'
import manage from './todo/manage.vue'

import addPerson from './todo/addPerson.vue'
import addJob from './todo/addJob.vue'
import familyTree from './todo/familyTree.vue'
import guanzhiTree from './todo/GuanZhiTree.vue'

import experience from './todo/experience.vue'

import calendar from './todo/calendar.vue'

import commonDct from './todo/commonDct.vue'
import Dct from './todo/Dct.vue'

import adminSet from './todo/adminSet.vue';
import map from './todo/map.vue'
import map1 from './todo/map1.vue'

import store from './store';

//import axios from './axios/index.js'
import tools from './tools/js/tools.js'

Vue.prototype.$tools = tools

const routes = [{
		path: '/',
		component: login
	},
	{
		path: '/manage',
		component: manage,
		name: '管理页',
		children: [{
				path: '/addPerson',
				component: addPerson,
				meta: ['源数据', '添加人物'],
			}, {
				path: '/addJob',
				component: addJob,
				meta: ['源数据', '添加官职'],
			}, {
				path: '/experience',
				component: experience,
				meta: ['源数据', '添加履历'],
			},
			{
				path: "/commonDCT",
				component: commonDct,
				meta: ['源数据', '字典表'],
			},
			{
				path: "/commonDCT?dctid=attribute&page=0",
				component: commonDct,
				meta: ['源数据', '特性表'],
			},
			{
				path: "/commonDCT?dctid=attributeTime",
				component: commonDct,
				meta: ['源数据', '特性时间表'],
			}, {
				path: "/familyTree",
				component: familyTree,
				meta: ['数据展示', '家谱树'],
			},
			{
				path: "/GuanZhiTree",
				component: guanzhiTree,
				meta: ['数据展示', '家谱树'],
			},
			{
				path: "/map",
				component: map,
				meta: ['数据展示', '地图'],
			},
			{
				path: "/map1",
				component: map1,
				meta: ['数据展示', '地图1'],
			},
			{
				path: '/calendar',
				component: calendar,
				meta: ['数据展示', '万年历'],
			}, {
				path: '/adminSet',
				component: adminSet,
				meta: ['账号管理', '个人信息'],
			}, {
				path: '/Dct',
				component: Dct,
				meta: ['建模管理', '字典管理'],
			}
		]
	}
]

//创建路由对象并配置路由规则
let router = new VueRouter({
	routes: routes,
	mode: 'history'
});

router.beforeEach(async(to, from, next) => {
	if(to.path === '/login') {
		next()
	} else {
		next()

		//  if (Store.getters.menus.length === 0 || Store.getters.dict.size === 0) {
		//    if (Store.getters.menus.length === 0) {
		//      // 同步获取菜单
		//      await getMenuList()
		//    }
		//    if (Store.getters.dict.size === 0) {
		//      // 同步获取字典
		//      await getDictListAll()
		//    }
		//    next()
		//  } else {
		//    next()
		//  }
	}
})

// 字典
async function getDictListAll() {
	try {
		let res = await axios.get('/api/getMenus.do')
		Store.commit('setMenu', res.data.data)
	} catch(e) {
		console.log(e)
	}
}
// 菜单
async function getMenuList() {
	try {
		Store.commit('setMenu', [])
	} catch(e) {
		console.log(e)
	}
}

/* new Vue 启动 */
new Vue({
	el: '#app',
	render: c => c(App),
	mode: 'history', //解决刷新页面访问不到页面的问题
	//让vue知道我们的路由规则
	router, //可以简写为router
	store
})