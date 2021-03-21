<template>
	<div class="full" style="padding: 10px;">
		<el-input v-model="value" style="width:200px" @change="zhuanhuan"></el-input>
		<br>
		<el-button @click="zhuanhuan">转换</el-button>
		<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="textarea">
		</el-input>

		简短逗号分隔的字符串
		<el-input v-model="value1" style="width:200px"></el-input>
		<br>
		<el-button @click="zhuanhuan1">转换</el-button>
		<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="textarea1" style="margin-bottom:10px;">
		</el-input>

		<h3>输入文字模板1：</h3> 一库房左侧一个，右侧两个，中间两个，密集架背面左侧两个，中间两个，右侧两个
		<br>
		<h3>点击转换按钮，你会得到：</h3> 一库房左侧一个
		<br>右侧两个
		<br>中间两个
		<br>密集架背面左侧两个
		<br>中间两个
		<br>右侧两个<br>

		<el-input v-model="value2" style="width:200px；margin-top:10px"></el-input>
		<el-button @click="zhuanhuan2">转换</el-button>
		<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="textarea2">
		</el-input>

		<h3>输入文字模板2：</h3>
		<br>文成帝拓跋浚
		<br>阳平幽王拓跋新成
		<br>京兆康王拓跋子推
		<br>济阴王拓跋小新成
		<br>
		<h3>点击转换按钮，你会得到：</h3>
		<br>拓跋浚			文成帝
		<br>拓跋新成			阳平幽王
		<br>拓跋子推			京兆康王
		<br>拓跋小新成			济阴王
		<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="value3">
		</el-input>

		<el-button @click="zhuanhuan3">转换</el-button>
		<el-input type="textarea" :autosize="{ minRows: 6, maxRows: 10}" placeholder="请输入内容" v-model="textarea3">
		</el-input>
		
		

	</div>
</template>

<script>
	export default {
		name: 'item-Data',
		data() {
			return {
				value: '',
				textarea: '',
				value1: '',
				textarea1: '',
				value2: '',
				textarea2: '',
				value3: '',
				textarea3: ''
			}
		},
		methods: {
			zhuanhuan() {
				let data = this.value.replace(/\s*/g, "");
				data = data.replace("-", "");
				data = data.replace("一", "");
				data = data.replace(")", "");
				data = data.replace("）", "");
				data = data.replace("(", "（");
				let arr = data.split("（")
				let str0 = arr[0]
				let str1 = arr[1].slice(0, 3)
				let str2 = arr[1].slice(3, 6)
				this.textarea = str0 + "	" + str1 + "	" + str2
			},
			zhuanhuan1() {
				let data = this.value1.replace(/\s*/g, "");
				data = data.replace("-", "");
				data = data.replace("一", "");
				data = data.replace(")", "");
				data = data.replace("）", "");
				data = data.replace("。", "");
				data = data.replace(new RegExp("、", "gm"), "\n");
				this.textarea1 = data
			},
			zhuanhuan2() {
				let data = this.value2.replace(/\s*/g, "");
				if(data.search("，") != -1) {
					data = data.replace(new RegExp("，", "gm"), "\n");
				}
				if(data.search("、") != -1) {
					data = data.replace(new RegExp("、", "gm"), "\n");
				}
				this.textarea2 = data
			},
			zhuanhuan3() {
				let data = this.value3
				var str = ""; //总字符串
				var str1 = "";
				data = data.replace("。", "\n")
				data = data.replace(new RegExp("。", "gm"), "");
				data = data.replace(/\[.*?\]/g, '');
				data = data.split("\n");
				for(var i = 0; i < data.length; i++) {
					data[i]= data[i].replace("，", "	");
					if(data[i].search("王") != -1 || data[i].search("帝") != -1) {
						for(var j in data[i]) {
							if(data[i][j] == "王" || data[i][j] == "帝") {
								str1 = data[i].substring(j-0+1, data[i].length) + "	" + data[i].slice(0, j-0+1) 
									str += str1 + "\n"
								break;
							}
						}
					} else {
						str += data[i]+"\n"
					}
				}
				this.textarea3 = str
			}
		}
	}
</script>

<style lang="less" scoped="scoped">

</style>