import App from './app.vue'
import VueRouter from 'vue-router'

import './assets/styles/global.css'

import login from './todo/login.vue'
import manage from './todo/manage.vue'

import addPerson from './todo/addPerson.vue'
import addJob from './todo/addJob.vue'
import experience from './todo/experience.vue'
import upFile from './todo/upFile.vue'
import table1 from './todo/table1.vue'
import table3 from './todo/table3.vue';

import explain from './todo/explain.vue'
import WuJia from './todo/WuJia.vue'
import FWQ from './todo/FWQ.vue'

import calendar from './todo/calendar.vue'

import manage from './todo/manage.vue'



import adminSet from './todo/adminSet.vue';

import store from './store';

import hlx from './todo/hlx.vue';

import axios from './axios/index.js'

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
				meta: ['添加数据', '添加人物'],
			}, {
				path: '/addJob',
				component: addJob,
				meta: ['添加数据', '添加官职'],
			}, {
				path: '/experience',
				component: experience,
				meta: ['添加数据', '添加履历'],
			}, {
				path: '/upFile',
				component: upFile,
				meta: ['添加数据', '上传物价表'],
			}, {
				path: '/table1',
				component: table1,
				meta: ['添加数据', '自定义表格'],
			},  {
				path: '/hlx',
				component: hlx,
				meta: ['添加数据', '自定义表格3'],
			},
			{
				path: '/explain',
				component: explain,
				meta: ['技术说明', '技术说明'],
			}, {
				path: '/WuJia',
				component: WuJia,
				meta: ['物价表', '物价表'],
			}, {
				path: '/FWQ',
				component: FWQ,
				meta: ['服务器列表', '服务器列表'],
			}, {
				path: '/calendar',
				component: calendar,
				meta: ['唐', '万年历'],
			}, {
				path: '/calendar',
				component: calendar,
				meta: ['唐', '万年历'],
			}, {
				path: '/adminSet',
				component: adminSet,
				meta: ['账号管理', '个人信息'],
			}
		]
	}
]

//创建路由对象并配置路由规则
let router = new VueRouter({
	routes: routes,
	mode: 'history'
});


/* new Vue 启动 */
new Vue({
	el: '#app',
	render: c => c(App),
	mode: 'history', //解决刷新页面访问不到页面的问题
	//让vue知道我们的路由规则
	router, //可以简写为router
	store
})