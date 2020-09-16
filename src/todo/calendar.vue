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
			<div id="calendar" v-show="WNL_flag" class="tab" style="height: caLc(100% - 45px);">
				<el-calendar v-model="value">
				</el-calendar>
			</div>
			<div id="tree" v-show="SXT_flag" class="tab">
				<!--树形图-->
				<el-tree :props="props" :load="loadNode" lazy class="new-tree" @node-click="node_click" keep-alive>
				</el-tree>
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
				<BaseTable pageSize="15" :handleCurrentChange="handleCurrentChange" @selectedTableData="selectedTableData" :page="tableData.page" :tableHead="tableHead" :tableData.sync="tableData" :tableHeight.sync="tableData.tableHeight"></BaseTable>
			</div>
		</div>
		<div class="right">
			<div class="top">
				<div class="searchs">
					<el-input v-model="year" placeholder="年" style="width:20%"></el-input>
					<el-input v-model="month" placeholder="月" style="width:16%"></el-input>
					<el-input v-model="day" placeholder="日" style="width:16%"></el-input>
					<el-button icon="el-icon-search" style="width:16%" @click="searchs()"></el-button>
				</div>
			</div>
			<div class="bottom">
				<el-form ref="form" class="form">
					<el-input v-model="Title" placeholder="标题" class="title"></el-input>
					<div class="bgImage" :style="{backgroundImage: 'url(' + eventImgUrl + ')' }"></div>
					<el-form-item class="textareaForm">
						<textarea autocomplete="off" class="el-textarea__inner" rows="4" style="min-height: 33px;" v-model="GuWen">{{GuWen}</textarea>
						<textarea autocomplete="off" class="el-textarea__inner" rows="12" style="min-height: 33px;" v-model="Caption">{{Caption}</textarea>
						<div class="tagdiv">
							是否精确：
							<el-switch v-model="JingQue" active-value="1" inactive-value="0" active-color="#0000FF" inactive-color="#808080">
							</el-switch>
							<el-select v-model="bookValue" clearable filterable class="eventType" placeholder="请选择类型" size="mini">
								<el-option v-for="item in bookType" :key="item.id" :label="item.F_MC" :value="item.id">
								</el-option>
							</el-select>
						</div>
						<div class="bottomFloor">
							<div class="info">编写：{{event.userName}}</div>
							<div class="info">更新时间：{{event.updateTime}}</div>
							<el-select v-model="eventType" clearable filterable class="eventType" placeholder="请选择类型" size="mini">
								<el-option v-for="item in eventType_All" :key="item.id" :label="item.F_MC" :value="item.F_T1">
								</el-option>
							</el-select>
							<el-button size="small" @click="save">记录</el-button>
						</div>
					</el-form-item>
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
				EventData: {

				},
				total: 0,
				value: new Date(700, 1, 1), //时间对象
				SXT_filterText: '', //树形图的过滤文本
				dynamicTags: [],
				inputVisible: false,
				inputValue: '',
				Event: "",
				Title: "",
				Caption: "",
				MYURL: this.$store.state.MYURL,
				GuWen: "",
				year: "",
				month: "",
				day: "",
				imgUrl: '',
				props: {
					label: 'name',
					children: 'zones',
					isLeaf: 'leaf'
				},
				tree_data: "",
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
				eventType: '',
				eventType_All: [],
				bookValue: '',
				bookType: [],
				eventImgUrl: '',
				JingQue: "1",
				currentId: null,
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
			vm.year = vm.value.getFullYear();
			vm.month = vm.value.getMonth() - 1 + 2;
			vm.day = vm.value.getDate();
			vm.SearchMonthStories()
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
			onSubmit() {
				console.log('submit!');
			},
			handleClose(tag) {
				vm.dynamicTags.splice(vm.dynamicTags.indexOf(tag), 1);
			},

			showInput() {
				vm.inputVisible = true;
				vm.$nextTick(_ => {
					vm.$refs.saveTagInput.$refs.input.focus();
				});
			},

			handleInputConfirm() {
				let inputValue = vm.inputValue;

				if(inputValue) {
					vm.dynamicTags.push(inputValue);
				}
				vm.inputVisible = false;
				vm.inputValue = '';
			},
			save() {
				let year
				if(vm.year >= 1000) {
					year = vm.year
				}
				if(vm.year < 1000 && vm.year >= 100) {
					year = '0' + vm.year
				}
				if(vm.year < 100 && vm.year >= 10) {
					year = '00' + vm.year
				}
				if(vm.year < 10 && vm.year > 0) {
					year = '000' + vm.year
				}
				let option = {
					Title: vm.Title, //事件标题
					Caption: vm.Caption, //事件内容
					Time: year + "" + (vm.month >= 10 ? vm.month : "0" + vm.month) + (vm.day >= 10 ? vm.day : "0" + vm.day), //具体时间，小于10的前面要加0
					Year: year - 0, //年份
					Month: vm.month, //月份 
					Tag: vm.dynamicTags.join(','), //Tag标签内容
					Filename: "",
					URL: vm.imgUrl,
					userName: localStorage.getItem("username"),
					updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
					eventType:this.eventType,
					bookValue: this.bookValue
				}
				axios.post(this.MYURL + 'WriteStories.do?', {
					params: option
				}).then(data => {
					this.$message(data.data.text + "\n" + data.data.sql);
					this.SearchMonthStories();
//					this.node_had.childNodes = []; //把存起来的node的子节点清空，不然会界面会出现重复树！
//					this.loadNode(this.node_had, this.resolve_had); //再次执行懒加载的方法
				})
				let value = [{
					refer: '',
					time: year + "" + (vm.month >= 10 ? vm.month : "0" + vm.month) + (vm.day >= 10 ? vm.day : "0" + vm.day), //具体时间，小于10的前面要加0
					userName: localStorage.getItem("username"),
					updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
					caption: this.Caption,
					year: year - 0 + "", //年份,
					month: this.month, //月份 ,
					day: '',
					GuWen: this.GuWen,
					JingQue: this.JingQue,
					bookValue: this.bookValue
				}]
				if(this.currentId == null || this.currentId == undefined) {
					axios.post(this.$store.state.MYURL + 'InsertTableRow.do', {
							params: {
								tablename: "event_mx",
								Insertcol: "refer,time,userName,updateTime,caption,year,month,day,GuWen",
								values: value
							}
						})
						.then(res => {
							this.$message({
								type: 'success',
								message: res.data.msg
							});
						})
				} else {
					value = [{
						id: this.currentId,
						refer: '',
						time: year + "" + (vm.month >= 10 ? vm.month : "0" + vm.month) + (vm.day >= 10 ? vm.day : "0" + vm.day), //具体时间，小于10的前面要加0
						userName: localStorage.getItem("username"),
						updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
						caption: this.Caption,
						year: year - 0, //年份,
						month: this.month, //月份 ,
						day: '',
						GuWen: this.GuWen,
						JingQue: this.JingQue,
						bookValue: this.bookValue

					}]
					axios.post(this.$store.state.MYURL + 'UpdateTableRow.do', {
							params: {
								tablename: "event_mx",
								Insertcol: "id,refer,time,userName,updateTime,caption,year,month,day,GuWen",
								values: value
							}
						})
						.then(res => {
							this.$message({
								type: 'success',
								message: res.data.msg
							});
						})
				}

			},
			SearchMonthStories() {
				axios.get(this.MYURL + 'SelectStories.do', {
					params: {
						Month: moment(vm.value).format('MM') - 0, //准确时间。减0是为了把字符串转换成数字，去0
						Year: moment(vm.value).format('YYYY') - 0 //年份
					}
				}).then(res => {
					vm.Event = res.data
					let time = parseInt(moment(vm.value).format('YYYYMMDD'))
					for(var i = 0; i < vm.Event.length; i++) {
						if(vm.Event[i].Time == time) {
							vm.event = vm.Event[i]
							vm.Title = vm.Event[i].Title;
							//							vm.Caption = vm.Event[i].caption;
							//							vm.updateTime = vm.Event[i].updateTime;
							if(vm.Event[i]["eventType"]) {
								vm.eventImgUrl = vm.$store.state.AliYunURL + vm.Event[i]["eventType"] + ".png" || ""
								vm.eventType = vm.Event[i].eventType
							} else {
								vm.eventImgUrl = vm.$store.state.FWQURL + "upload/bookBG.png" || ""
							}
							if(vm.Event[i].updateTime) {
								vm.$refs.form.$el.style.height = '740px'
							} else {
								vm.$refs.form.$el.style.height = '700px'
							}
							break;
						}
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
					if(res.data.data.length != 0) {
						this.Caption = res.data.data[0].caption
						this.GuWen = res.data.data[0].GuWen
						this.total = parseInt(res.data.data.length) + 1
						this.JingQue = res.data.data[0].JingQue + ""
						this.currentId = res.data.data[0].id
						this.bookValue = res.data.data[0].bookValue - 0
						if(res.data.data.length > 1) {
							alert(1)
						}
					} else {
						this.GuWen = ""
						this.Caption = ""
						this.bookValue = ""
						this.currentId = null
					}
				})
			},
			searchs() {
				vm.value = new Date(vm.year, vm.month - 1, vm.day, 12, 0, 0)
			},
			loadNode(node, resolve) {
				if(node.level === 0) {
					vm.node_had = node; //这里是关键！在data里面定义一个变量，将node.level == 0的node存起来
					vm.resolve_had = resolve; //同上，把node.level == 0的resolve也存起来
					axios.get(vm.MYURL + 'Search_Tree.do?', {
						params: {
							Type: "1"
						}
					}).then(res => {
						resolve(res.data)
					})
				} else if(node.level === 1) {
					axios.get(vm.MYURL + 'Search_Tree.do?', {
						params: {
							Type: "2",
							Year: node.data.name.substring(0, node.data.name.length - 1)
						}
					}).then(res => {
						resolve(res.data)
					})
				} else if(node.level === 2) {
					var year = node.parent.label.substring(0, node.parent.label.length - 1);
					var month = node.data.name.substring(0, node.data.name.length - 1);
					axios.get(vm.MYURL + 'Search_Tree.do?', {
						params: {
							Type: "3",
							Year: year,
							Month: month
						}
					}).then(res => {
						resolve(res.data)
					})
				} else {
					return resolve([]);
				}
			},
			node_click(node, data, obj) {
				if(data.level == "1") {
					vm.value = new Date(node.name.substring(0, node.name.length - 1), 0, 1, 1, 1, 1);
				}
				if(data.level == "2") {
					var year = data.parent.label.substring(0, data.parent.label.length - 1);
					var month = data.data.name.substring(0, data.data.name.length - 1);
					vm.value = new Date(year, month - 1, 1, 1, 1, 1);
				}
				if(data.level == "3") {
					var year = data.parent.parent.label.substring(0, data.parent.parent.label.length - 1);
					var month = data.parent.data.name.substring(0, data.parent.data.name.length - 1);
					//以下是获取日期 day
					var day = "";
					for(var i = 0; i < data.label.length; i++) {
						if(data.label[i] === "日") {
							break;
						} //
						day += data.label[i];
					}
					vm.value = new Date(year, month - 1, day, 1, 1, 1);
				}
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
			},
			upload(params) {
				const formData = new FormData();
				formData.append('file', params.file)
				const headerConfig = {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				};
				formData.append('originalname', params.file.name);
				axios.post(this.MYURL + 'up', formData, headerConfig).then(function(data) {
					if(data.data.status == 'success') {
						vm.imgUrl = vm.MYURL + "upload/" + data.data.filename
					}
				})
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
				this.currentPage = val
				this.searchRL()
			},
			selectedTableData(item) {
				this.value = new Date(item.year, item.month - 1, item.day)
			},
		},
		watch: {
			currentTime(val) {
				this.searchMX()
			},
			SXT_filterText(val) {
				this.$refs.Tree.filter(val);
			},
			eventType(val) {
				if(val) {
					vm.eventImgUrl = vm.$store.state.AliYunURL + val + ".png" || ""
				} else {
					vm.eventImgUrl = vm.$store.state.AliYunURL + "bookBG.png" || ""
				}
			},
			value(val, old_val) {
				this.$store.commit("setcurrentTime", moment(vm.value).format('YYYYMMDD'));
				vm.imgUrl = "";
				vm.SearchMonthStories();
				vm.year = moment(vm.value).format('YYYY') - 0 + 0;
				vm.month = moment(vm.value).format('MM') - 0 + 0;
				vm.day = moment(vm.value).format('DD') - 0 + 0;
				//修改右侧对应的caption
				for(var i = 0; i < vm.Event.length; i++) {
					if(vm.Event[i].Time == moment(vm.value).format('YYYYMMDD')) {
						vm.event = vm.Event[i]
						vm.Title = vm.Event[i].Title;
						//						vm.Caption = vm.Event[i].caption;
						vm.updateTime = vm.Event[i].updateTime;
						if(vm.Event[i]["eventType"]) {
							vm.eventImgUrl = vm.$store.state.AliYunURL + vm.Event[i]["eventType"] + ".png" || ""
						} else {
							vm.eventImgUrl = vm.$store.state.AliYunURL + "bookBG.png" || ""
						}
						vm.event = vm.Event[i]
						break;
					} else {
						vm.Title = "";
						vm.Caption = "";
					}
				}
			}
		}
	};
</script>

<style lang="less">
	@import '../assets/styles/calendar';
</style>