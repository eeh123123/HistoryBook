<template>
	<div style="position: relative;">
		<div class="left">
			<div style="display: block;">
				<div class="tabbtn" @click="WNL()">万年历</div>
				<div class="tabbtn" @click="SXT()">树形图</div>
				<div class="tabbtn" @click="SJZ()">时间轴</div>
				<div style="clear:both;"></div>
			</div>
			<div id="calendar" v-show="WNL_flag" class="tab">
				<el-calendar v-model="value">
				</el-calendar>
			</div>
			<div id="tree" v-show="SXT_flag" class="tab">
				<el-tree :props="props" :load="loadNode1" lazy show-checkbox class="new-tree" @node-click="node_click">
				</el-tree>
			</div>
			<div id="line" v-show="SJZ_flag" class="tab">
				<el-input v-model="SJZ_val" placeholder="此处输入汉字模糊查询" style="width:30%;margin-left: 20px;"></el-input>
				<el-button type="primary" icon="el-icon-search" style="width:57px" @click="SJZ_search()"></el-button>
				<el-timeline style="margin:20px 0 0 20px">
					<el-timeline-item v-for="(activity, index) in SJZ_data" :key="index" :icon="activity.icon" :type="activity.type" :color="activity.color" :size="activity.size" :timestamp="activity.timestamp" @click.native="SJZ_click(activity.timestamp)">
						{{activity.content}}
					</el-timeline-item>
				</el-timeline>
			</div>
		</div>
		<div class="right">
			<el-form ref="form" :model="form" class="form">
				<el-input v-model="Title" placeholder="标题" class="title"></el-input>
				<div class="searchs">
					<el-input v-model="year" placeholder="年" style="width:20%"></el-input>
					<el-input v-model="month" placeholder="月" style="width:16%"></el-input>
					<el-input v-model="day" placeholder="日" style="width:16%"></el-input>
					<el-button type="primary" icon="el-icon-search" style="width:16%" @click="searchs()"></el-button>
				</div>
				<el-form-item>
					<textarea autocomplete="off" class="el-textarea__inner" rows="12" style="min-height: 33px;" v-model="Caption">{{Caption}</textarea>
					<div class="demo-image__error">
						<div class="block">
							<el-image :src="imgUrl"></el-image>
						</div>
					</div>
					<el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)">
						{{tag}}
					</el-tag>
				</el-form-item>
				<el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
				</el-input>
				<el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
				<el-upload class="upload-demo" :http-request="upload" action="localhost:8084/up" ref="upload" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="1" :on-exceed="handleExceed" :file-list="fileList">
					<el-button size="small" type="primary" slot="trigger">选择文件</el-button>
					<el-button size="small" type="success" @click="save">记录</el-button>
					<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
				</el-upload>
			</el-form>
		</div>

		<div style="clear:both;"></div>
	</div>
</template>

<script>let Write_Time = "";
let vm;
export default {
	data() {
		return {
			value: new Date(700, 1, 1), //时间对象
			story: "",
			form: {
				name: '',
				region: '',
				date1: '',
				date2: '',
				delivery: false,
				type: [],
				resource: '',
				desc: ''
			},
			//dynamicTags: ['标签一', '标签二', '标签三'], //标签对象
			dynamicTags: [],
			inputVisible: false,
			inputValue: '',
			fileList: [],
			Event: "",
			Title: "",
			Caption: "",
			MYURL: this.$store.state.MYURL,
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
			SJZ_val: ""
		}
	},
	filters: {
		formatDate: function(value) {
			return moment(value).format('YYYY-MM-DD');
		}
	},
	beforecreated() {
		vm = this;
	},
	created() {
		vm = this;
	},
	mounted() {
		vm.year = vm.value.getFullYear();
		vm.month = vm.value.getMonth() - 1 + 2;
		vm.day = vm.value.getDate();

		vm.SearchMonthStories();
		vm.$watch('value', function(val, old_val) {
			vm.imgUrl = "";
			vm.SearchMonthStories();
			vm.year = moment(vm.value).format('YYYY') - 0 + 0;
			vm.month = moment(vm.value).format('MM') - 0 + 0;
			vm.day = moment(vm.value).format('DD') - 0 + 0;
			//修改右侧对应的caption
			for(var i = 0; i < vm.Event.length; i++) {
				if(vm.Event[i].Time == moment(vm.value).format('YYYYMMDD')) {
					vm.Title = vm.Event[i].Title;
					vm.Caption = vm.Event[i].Caption;
				} else {
					vm.Title = "";
					vm.Caption = "";
				}
			}
		});
	},
	methods: {
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
		//文件上传
		handleRemove(file, fileList) {
			console.log(file, fileList);
		},
		handlePreview(file) {

			console.log(file);
		},
		handleExceed(files, fileList) {
			vm.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
		},
		beforeRemove(file, fileList) {
			return vm.$confirm(`确定移除 ${ file.name }？`);
		},
		save() {
			$.get(vm.MYURL + 'WriteStories.do?', {
				Title: vm.Title, //事件标题
				Caption: vm.Caption, //事件内容
				Time: vm.year + "" + (vm.month >= 10 ? vm.month : "0" + vm.month) + (vm.day >= 10 ? vm.day : "0" + vm.day), //具体时间，小于10的前面要加0
				Year: vm.year, //年份
				Month: vm.month, //月份 
				Tag: vm.dynamicTags.join(','), //Tag标签内容
				Filename: "",
				URL: vm.imgUrl,
			}, function(data) {
				vm.$message(data.text + "\n" + data.sql);
				vm.SearchMonthStories();
			}, "json");
			return;
		},
		SearchMonthStories() {
			$.get(vm.MYURL + 'SelectStories.do', {
				Month: moment(vm.value).format('MM') - 0, //准确时间。减0是为了把字符串转换成数字，去0
				Year: moment(vm.value).format('YYYY') - 0 //年份
			}, function(data) {
				vm.Event = data; //这里没法用this了
				let time = parseInt(moment(vm.value).format('YYYYMMDD'))
				for(var i = 0; i < vm.Event.length; i++) {
					if(vm.Event[i].Time == time) {
						vm.Title = vm.Event[i].Title;
						vm.Caption = vm.Event[i].Caption;
						vm.imgUrl = vm.Event[i].url;
					}
				}
				vm.drawWrited();
			}, "json");
		},
		searchs() {
			vm.value = new Date(vm.year, vm.month - 1, vm.day, 12, 0, 0)
		},
		loadNode1(node, resolve) {
			if(node.level === 0) {
				$.get(vm.MYURL + 'Search_Tree.do?', {
					Type: "1"
				}, function(data) {
					resolve(data);
				});
			}
			if(node.level === 1) {
				$.get(vm.MYURL + 'Search_Tree.do?', {
					Type: "2",
					Year: node.data.name.substring(0, node.data.name.length - 1)
				}, function(data) {
					resolve(data);
				});
			}
			if(node.level === 2) {
				var year = node.parent.label.substring(0, node.parent.label.length - 1);
				var month = node.data.name.substring(0, node.data.name.length - 1);
				$.get(vm.MYURL + 'Search_Tree.do?', {
					Type: "3",
					Year: year,
					Month: month
				}, function(data) {
					resolve(data);
				});
			}
			if(node.level === 3) {
				return resolve([]);
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
			vm.SearchMonthStories();
		},
		WNL() {
			vm.WNL_flag = true;
			vm.SXT_flag = false;
			vm.SJZ_flag = false;
		},
		SXT() {
			vm.WNL_flag = false;
			vm.SXT_flag = true;
			vm.SJZ_flag = false;
		},
		SJZ() {
			vm.WNL_flag = false;
			vm.SXT_flag = false;
			vm.SJZ_flag = true;
			vm.SJZ_search();
		},
		drawWrited() {
			$("tbody").find("span").parent().removeClass("writed");
			for(var i = 0; i < vm.Event.length; i++) {
				var span = $("tbody").find("span");
				let flag = 0;
				for(var k = 0; k < span.length; k++) {
					if(span[k].innerText == 1) {
						flag++;
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
		},
		SJZ_search() {
			$.get(vm.MYURL + 'Search_SJZ.do?', {
				Caption: vm.SJZ_val, //时间轴查找的关键字
			}, function(data) {
				vm.SJZ_data = data;
			}, "json");
		},
		SJZ_click(data) {
			var time = data;
			if(time.length < 14) {
				time += " 00:00:00";
			}
			//var timestamp = new Date(time).getTime();
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
	}
};</script>

<style lang="css" scoped>@import '../assets/styles/calendar.css';
.left {
	float: left;
	width: calc(100% - 500px);
}

.right {
	float: right;
	width: 500px;
	padding: 15px;
}

textarea {
	text-indent: 25px
}
</style>