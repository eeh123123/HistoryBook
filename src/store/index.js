//创建Vue实例
const store = new Vuex.Store({
	state: {
		MYURL: "http://localhost:8084/",
		LoginState: false,
		Dialog_show: false,
		Dialog_data:{total:0,data:[]},
		PinJie_FBH: [],
		Dialog_Col_Name: [],
		Dialog_title: "",
		Dialog_PageSize: 10,
		Dialog_tablename: "",
		Dialog_showcol: "",
		Dialog_sqlwhere: "",
		Dialog_CallBack: "",
		Sql_value: "",

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
				.catch(function(error) {
					console.log(error);
				});
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
	}
})

export default store //导出store