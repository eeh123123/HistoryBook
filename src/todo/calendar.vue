<template>
	<div class="main calendar">
		<div class="left">
			<div style="display: block;">
				<div class="tabbtn" @click="WNL()">万年历</div>
				<div class="tabbtn" @click="SXT()">树形图</div>
				<div class="tabbtn" @click="SJZ()">时间轴</div>
				<div class="tabbtn" @click="RLClick()">日历</div>
				<div style="clear:both"></div>
			</div>
			<div id="calendar" v-show="WNL_flag" class="tab" style="height: calc(100% - 45px);">
				<el-calendar v-model="value">
				</el-calendar>
			</div>
			<div id="tree" v-show="SXT_flag" class="tab">
				<!--树形图-->
				<el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
			</div>
			<div id="line" v-show="SJZ_flag" class="tab" keep-alive>
				<el-input v-model="SJZ_val" placeholder="此处输入汉字模糊查询" style="width:30%;margin-left: 20px;"></el-input>
				<el-button type="primary" icon="el-icon-search" style="width:57px" @click="SJZ_search()"></el-button>
				<el-timeline style="margin:20px 0 0 20px">
					<el-timeline-item v-for="(activity, index) in SJZ_data" :key="index" :icon="activity.icon" :type="activity.type" :color="activity.color" :size="activity.size" :timestamp="activity.timestamp" @click.native="SJZ_click(activity.timestamp)">
						{{activity.content}}
					</el-timeline-item>
				</el-timeline>
			</div>
			<div v-show="RL_flag" class="tab RL" style="height: caLc(100% - 45px);" keep-alive>
				<el-input v-model="RL.year" placeholder="公历年"></el-input>
				<el-input v-model="RL.month" placeholder="公历月"></el-input>
				<el-input v-model="RL.nongliYue" placeholder="农历月"></el-input>
				<el-input v-model="RL.tiandi" placeholder="天干地支"></el-input>
				<el-button icon="el-icon-search" @click="searchRL()">搜索</el-button>
				<simpleTable @selectedTableData="selectedTableData" :tableHead="tableHead" :tableData.sync="tableData" :currentPage.sync="currentPage" :tableHeight.sync="tableData.tableHeight" :selection="false" :highlightCurrentRow="false">
				</simpleTable>
			</div>
		</div>
		<div class="right">
			<div class="bottom">
				<el-form ref="form" class="form">
					<el-input v-model="Title" placeholder="标题" class="title"></el-input>
					<div class="bottomDiv">
						<div class="bgImage" :style="{backgroundImage: 'url(' + eventImgUrl + ')' }"></div>
						<el-form-item class="textareaForm">
							<textarea autocomplete="off" class="el-textarea__inner" rows="8" style="min-height: 33px;" v-model="GuWen">{{GuWen}</textarea>
							<textarea autocomplete="off" class="el-textarea__inner" rows="11" style="min-height: 33px;" v-model="Caption">{{Caption}</textarea>
							<div class="tagdiv">
								是否精确：
								<el-switch v-model="JingQue" active-value="1" inactive-value="0" active-color="#0000FF" inactive-color="#808080">
								</el-switch>
								<el-select v-model="event_mx.bookValue" clearable filterable class="eventType" placeholder="请选择类型" size="mini">
									<el-option v-for="item in bookType" :key="item.id" :label="item.F_MC" :value="item.id">
									</el-option>
								</el-select>
							</div>
							<div class="bottomFloor">
								<div class="info">编写：{{event.userName}}</div>
								<div class="info">更新时间：{{event.updateTime}}</div>
								<div style="clear: both;"></div>
								<div class="box">
									<el-select v-model="event_mx.eventType" filterable clearable filterable class="eventType" style="float: left;" placeholder="请选择类型" size="mini">
										<el-option v-for="item in eventType_All" :key="item.id" :label="item.F_MC" :value="item.F_T1">
										</el-option>
									</el-select>
									<el-pagination background small :page-size="1" layout="prev, pager, next" :total="event_mx.total" current-page.sync="event_mx.pageIndex" @current-change="handleCurrentChange">
									</el-pagination>
									<el-button size="small" @click="save" type="primary">记录</el-button>
								</div>
							</div>
						</el-form-item>
					</div>
				</el-form>
			</div>
		</div>
		<div style="clear:both;"></div>
	</div>
</template>

<script>
	import BaseTable from '../tools/BaseTable.vue'
	let Write_Time = "";
	let vm;
	export default {
		components: {
			BaseTable
		},
		data() {
			return {
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'label'
				},

				common: {
					year: "",
					month: "",
					day: "",
					Time: "",
				},
				event: {
					Title: "",
				},
				event_mx: {
					userName: "",
					updateTime: "",
					bookValue: "",
					eventType: "",
					currentId: null,
					total: 1,
					pageIndex: 1
				},
				value: new Date(700, 1, 1), //时间对象
				SXT_filterText: '', //树形图的过滤文本
				Event: "",
				Title: "",
				Caption: "",
				MYURL: this.$store.state.MYURL,
				GuWen: "",
				imgUrl: '',
				SJZ_data: [{
					content: '支持使用图标',
					timestamp: '2018-04-12 20:46',
					size: 'large',
					type: 'primary',
					icon: 'el-icon-more'
				}, {
					content: '支持自定义颜色',
					timestamp: '2018-04-03 20:46',
					color: '#0bbd87'
				}, {
					content: '支持自定义尺寸',
					timestamp: '2018-04-03 20:46',
					size: 'large'
				}, {
					content: '默认样式的节点',
					timestamp: '2018-04-03 20:46'
				}],
				WNL_flag: true,
				SJZ_flag: false,
				SXT_flag: false,
				RL_flag: false,
				SJZ_val: "",
				event: {},
				eventType_All: [],
				bookType: [],
				eventImgUrl: '',
				JingQue: "1",
				RL: {
					year: '',
					month: '',
					nongliYue: '',
					tiandi: ''
				},
				tableHead: [{
					code: "year",
					label: "年"
				}, {
					code: "month",
					label: "月"
				}, {
					code: "day",
					label: "日"
				}, {
					code: "nongli",
					label: "农历"
				}, {
					code: "tiandi",
					label: "干支"
				}],
				tableData: {
					data: [],
					total: 0,
					map: new Map(),
					tableHeight: 600,
					page: {
						pageSize: 15
					}
				},
				currentPage: 1,
			}
		},
		computed: {
			currentTime: function() {
				this.common.year = this.$store.state.currentTime.slice(0, 4) - 0
				this.common.month = this.$store.state.currentTime.slice(4, 6) - 0
				this.common.day = this.$store.state.currentTime.slice(6, 8) - 0
				return this.$store.state.currentTime
			}
		},
		filters: {
			formatDate: function(value) {
				return moment(value).format('YYYY-MM-DD');
			}
		},
		created() {
			vm = this;
		},
		mounted() {
			this.common.year = this.value.getFullYear();
			this.common.month = this.value.getMonth() - 1 + 2;
			this.common.day = this.value.getDate();

			this.queryTreeData()
			this.SearchMonthStories()

			this.queryEventType()
			this.setBookType()
			this.setTableHeight()
		},
		methods: {
			setTableHeight() {
				setTimeout(() => {
					this.tableData.tableHeight = document.getElementById("calendar").offsetHeight - 100
				}, 100)
			},
			getTime() {
				let year
				if(this.common.year >= 1000) {
					year = this.common.year
				}
				if(this.common.year < 1000 && this.common.year >= 100) {
					year = '0' + this.common.year
				}
				if(this.common.year < 100 && this.common.year >= 10) {
					year = '00' + this.common.year
				}
				if(this.common.year < 10 && this.common.year > 0) {
					year = '000' + this.common.year
				}
				let time = year + "" + (this.common.month >= 10 ? this.common.month : "0" + this.common.month) + (this.common.day >= 10 ? this.common.day : "0" + this.common.day) //具体时间，小于10的前面要加0
				return {
					year: this.common.year,
					month: this.common.month,
					day: this.common.day,
					time: time
				}
			},
			queryTreeData() {
				axios.get(this.MYURL + 'QueryTableRow.do', {
					params: {
						tablename: "event",
						showcol: "*",
						sqlwhere: "1=1 order by time"
					}
				}).then(res => {
					var map = new Map();
					var map2 = new Map();
					var data = res.data.data
					for(var i = 0; i < data.length; i++) {
						map.set(data[i].year, data[i].year) //获取年份
						map2.set(data[i].year, new Map())
					}
					for(var [key, value] of map) {
						this.treeData.push({
							id: key,
							label: key + "年",
							children: []
						})
					}
					for(var i = 0; i < data.length; i++) {
						for(var j = 0; j < this.treeData.length; j++) {
							if(data[i].year == this.treeData[j].id) {
								map2.get(data[i].year).set(data[i].month, data[i].month)
							}
						}
					}
					for(var [key, value] of map2) {
						for(var j = 0; j < this.treeData.length; j++) {
							if(key == this.treeData[j].id) {
								for(var [key1, value1] of value) {
									this.treeData[j].children.push({
										id: key1,
										label: key1 + "月",
										children: new Map()
									})
								}
							}
						}
					}

				})
			},
			handleNodeClick() {

			},
			save() {
				let params = this.getTime()
				let option = {
					Title: this.Title, //事件标题
					Caption: this.Caption, //事件内容
					time: params.time, //年份
					year: params.year,
					month: params.month, //月份 
					Filename: "",
					URL: this.imgUrl,
					userName: localStorage.getItem("username"),
					updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
					eventType: this.event_mx.eventType,
					bookValue: this.event_mx.bookValue
				}
				axios.post(this.MYURL + 'WriteStories.do?', {
					params: option
				}).then(data => {
					this.$message(data.data.text + "\n" + data.data.sql);
				})
				let value = [{
					title: this.Title, //事件标题
					time: params.time, //年份
					year: params.year,
					month: params.month, //月份
					userName: localStorage.getItem("username"),
					updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
					caption: this.Caption,
					day: '',
					GuWen: this.GuWen,
					JingQue: this.JingQue,
					eventType: this.event_mx.eventType,
					bookValue: this.event_mx.bookValue
				}]
				if(this.event_mx.currentId == null || this.event_mx.currentId == undefined || this.event_mx.currentId === "") {
					axios.post(this.$store.state.MYURL + 'InsertTableRow.do', {
							params: {
								tablename: "event_mx",
								Insertcol: "title,time,userName,updateTime,caption,year,month,day,GuWen",
								values: value
							}
						})
						.then(res => {
							this.$message({
								type: 'success',
								message: res.data.msg
							});
							this.SearchMonthStories();
						})
				} else {
					value = [{
						id: this.event_mx.currentId,
						time: params.time, //年份
						userName: localStorage.getItem("username"),
						updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
						caption: this.Caption,
						year: params.year,
						month: params.month, //月份
						day: '',
						GuWen: this.GuWen,
						JingQue: this.JingQue,
						eventType: this.event_mx.eventType,
						bookValue: this.event_mx.bookValue,
						title: this.Title, //事件标题
					}]
					axios.post(this.$store.state.MYURL + 'UpdateTableRow.do', {
							params: {
								tablename: "event_mx",
								Insertcol: "id,time,userName,updateTime,caption,year,month,day,GuWen,title",
								values: value
							}
						})
						.then(res => {
							this.$message({
								type: 'success',
								message: res.data.msg
							});
							this.SearchMonthStories()
							this.searchMX()
						})
				}

			},
			SearchMonthStories() {
				axios.get(this.$store.state.MYURL + 'SelectStories.do', {
					params: {
						Month: this.common.month, //准确时间。减0是为了把字符串转换成数字，去0
						Year: this.common.year //年份
					}
				}).then(res => {
					this.Event = res.data
					let time = parseInt(moment(vm.value).format('YYYYMMDD'))
					//修改右侧对应的caption
					for(var i = 0; i < vm.Event.length; i++) {
						if(vm.Event[i].Time == this.currentTime) {
							vm.event = vm.Event[i]
							vm.Title = vm.Event[i].title;
							vm.updateTime = vm.Event[i].updateTime;
							if(vm.Event[i]["eventType"]) {
								vm.eventImgUrl = vm.$store.state.AliYunURL + vm.Event[i]["eventType"] + ".png" || ""
							} else {
								vm.eventImgUrl = vm.$store.state.AliYunURL + "bookBG.png" || ""
							}
							vm.event = vm.Event[i]
							break;
						} else {
							this.Title = "";
							this.event_mx.currentId = ""
						}
					}
					if(this.Event.length == 0) {
						this.Title = "";
						this.Caption = "";
						this.event_mx.currentId = ""
					}
					vm.drawWrited();
				})
			},
			searchMX() {
				let option = {
					tablename: "event_mx",
					showcol: ['*'],
					sqlwhere: "1=1 AND time= '" + this.currentTime + "'"
				}
				axios.get(this.MYURL + 'QueryTableRow.do', {
					params: {
						tablename: option.tablename,
						showcol: option.showcol.join(","),
						sqlwhere: option.sqlwhere
					}
				}).then(res => {
					res.data.data.push({
						Caption: '',
						GuWen: '',
						JingQue: 1,
						id: '',
						bookValue: '',
						eventType: ''
					})
					var length = res.data.data.length
					if(res.data.data.length != 0) {
						if(res.data.data[length - 1].title) {
							this.Title = res.data.data[this.event_mx.pageIndex - 1].title
						}
						this.Caption = res.data.data[this.event_mx.pageIndex - 1].caption
						this.GuWen = res.data.data[this.event_mx.pageIndex - 1].GuWen
						this.event_mx.total = parseInt(length)
						this.JingQue = res.data.data[this.event_mx.pageIndex - 1].JingQue + ""
						this.event_mx.currentId = res.data.data[this.event_mx.pageIndex - 1].id
						this.event_mx.bookValue = res.data.data[this.event_mx.pageIndex - 1].bookValue - 0
						this.event_mx.eventType = res.data.data[this.event_mx.pageIndex - 1].eventType
					} else {
						this.GuWen = ""
						this.Caption = ""
						this.event_mx.currentId = null
					}
				})
			},
			searchs() {
				vm.value = new Date(vm.year, vm.month - 1, vm.day, 12, 0, 0)
			},
			WNL() {
				vm.WNL_flag = true;
				vm.SXT_flag = false;
				vm.SJZ_flag = false;
				vm.RL_flag = false
			},
			SXT() {
				vm.WNL_flag = false
				vm.SXT_flag = true
				vm.SJZ_flag = false
				vm.RL_flag = false
			},
			SJZ() {
				vm.WNL_flag = false;
				vm.SXT_flag = false;
				vm.SJZ_flag = true
				vm.RL_flag = false
				vm.SJZ_search()
			},
			RLClick() {
				vm.WNL_flag = false
				vm.SXT_flag = false
				vm.SJZ_flag = false
				vm.RL_flag = true
			},
			drawWrited() {
				let lastMounthFlag = 0; //上个月结束的下标标签
				$("tbody").find("span").parent().removeClass("writed");
				for(var i = 0; i < vm.Event.length; i++) {
					var span = $("tbody").find("span");
					let flag = 0;
					for(var k = 0; k < span.length; k++) {
						if(span[k].innerText == 1) {
							flag++;
							if(flag == 1) {
								lastMounthFlag = k;
							}
						}
						if(flag == 2) {
							break;
						}
						var day = "";
						var time_day = "";
						for(var j = 0; j < vm.Event.length; j++) {
							day = span[k].innerText;
							time_day = vm.Event[j].Time.substr(6) - 0; //字符串转数字
							if(day == time_day) {
								$(span[k]).parent().addClass("writed");
							}
						}
					}
				}
				//这个月1号之前的div通通移除class :writed
				for(var j = 0; j < lastMounthFlag; j++) {
					$(span[j]).parent().removeClass("writed");
				}

			},
			SJZ_search() {
				axios.get(vm.MYURL + 'Search_SJZ.do?', {
					params: {
						Caption: vm.SJZ_val, //时间轴查找的关键字
					}
				}).then(res => {
					vm.SJZ_data = res.data;
				})
			},
			SJZ_click(data) {
				var time = data;
				if(time.length < 14) {
					time += " 00:00:00";
				}
				vm.value = time;
				this.$store.commit("setcurrentTime", moment(vm.value).format('YYYYMMDD'));
			},
			queryEventType() {
				axios.get(this.$store.state.MYURL + 'QueryTableRow.do', {
					params: {
						tablename: "dct_enums",
						showcol: ['*'],
						sqlwhere: "F_PARENT='01'"
					}
				}).then(res => {
					this.eventType_All = res.data.data
				})
			},
			setBookType() {
				axios.get(this.$store.state.MYURL + 'QueryTableRow.do', {
					params: {
						tablename: "dct_enums",
						showcol: ['*'],
						sqlwhere: "F_T3='2'"
					}
				}).then(res => {
					this.bookType = res.data.data
				})
			},
			searchRL() {
				var sqlwhere = "1=1 "
				if(this.RL.year) {
					sqlwhere += "AND year = " + this.RL.year
				}
				if(this.RL.month) {
					sqlwhere += " AND month = " + this.RL.month
				}
				if(this.RL.nongliYue) {
					sqlwhere += " AND nongli like '%" + this.RL.nongliYue + "月%'"
				}
				if(this.RL.tiandi) {
					sqlwhere += " AND tiandi = '" + this.RL.tiandi + "'"
				}
				axios.get(this.MYURL + 'QueryTableRow.do', {
					params: {
						tablename: "lifa",
						showcol: ['*'],
						sqlwhere: sqlwhere
					}
				}).then(res => {
					this.setTableHeight()
					this.tableData.data = res.data.data
				})
			},
			handleCurrentChange(val) {
				this.event_mx.pageIndex = val
				this.searchMX()
			},
			selectedTableData(item) {
				this.value = new Date(item.year, item.month - 1, item.day)
				this.$store.commit("setcurrentTime", moment(this.value).format('YYYYMMDD'));
			},
		},
		watch: {
			currentTime(val) {
				this.searchMX()
				this.SearchMonthStories()
			},
			SXT_filterText(val) {
				this.$refs.Tree.filter(val);
			},
			'event_mx.eventType' (val) {
				if(val) {
					vm.eventImgUrl = vm.$store.state.AliYunURL + val + ".png" || ""
				} else {
					vm.eventImgUrl = vm.$store.state.AliYunURL + "bookBG.png" || ""
				}
			}
		}
	};
</script>

<style lang="less">
	@import '../assets/styles/calendar';
</style>