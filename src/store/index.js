//创建Vue实例
const store = new Vuex.Store({
	state: {
		MYURL: process.env.NODE_ENV ==="development"?"http://localhost:8084/":"http://119.45.27.191:8084/",
		FWQURL: "http://119.45.27.191:8084/",
		AliYunURL: "https://historybook.oss-cn-beijing.aliyuncs.com/background/",
		LoginState: false,
		Dialog_show: false,
		Dialog_data: {
			total: 0,
			data: []
		},
		PinJie_FBH: [],
		Dialog_Col_Name: [],
		Dialog_title: "",
		Dialog_PageSize: 10,
		Dialog_tablename: "",
		Dialog_showcol: "",
		Dialog_sqlwhere: "",
		Dialog_CallBack: "",
		Sql_value: "",
		Drawer: false,
		FamilyData: {},
		PersonData: [{
			imgUrl: 'none.png'
		}],
		currentTime: '07000101',
		guanzhiDrawer:false,
		guanzhiData:{}
	},
	mutations: {
		setshow: (state, data) => {
			state.Dialog_show = data;
		},
		setCol_Name: (state, data) => {
			state.Dialog_Col_Name = data;
		},
		setDialog_CallBack: (state, data) => {
			state.Dialog_CallBack = data;
		},
		query_Dialog_data: (state, data) => {
			state.Dialog_tablename = data.tablename;
			state.Dialog_showcol = data.showcol;
			state.Dialog_sqlwhere = data.sqlwhere;
			axios.get(state.MYURL + 'QueryTableRow.do', {
					params: {
						tablename: data.tablename,
						showcol: data.showcol.join(","),
						sqlwhere: data.sqlwhere
					}
				})
				.then(function(response) {
					state.Dialog_data = response.data;
				})
		},
		setCol: (state, data) => {
			state.Dialog_data.total = data.data.length;
			state.Dialog_data.data = data.data;
		},
		setTitle: (state, data) => {
			state.Dialog_title = data;
		},
		setSQL_value: (state, data) => {
			state.Sql_value = data;
		},
		setDrawer: (state, data) => {
			state.Drawer = data;
		},
		setFamilyData: (state, data) => {
			state.FamilyData = data;
		},
		setPersonData: (state, data) => {
			state.PersonData = data;
		},
		setcurrentTime: (state, data) => {
			state.currentTime = data;
		},
		setguanzhiDrawer: (state, data) => {
			state.guanzhiDrawer = data;
		},
		setguanzhiData: (state, data) => {
			state.guanzhiData = data;
		},
		
	}
})

export default store //导出store